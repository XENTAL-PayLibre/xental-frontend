'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getRequest, postRequest, postFormRequest } from '@/lib/http';
import { API_ENDPOINTS } from './api-endpoints';

export type TrackStatus =
  | 'NotStarted' | 'InProgress' | 'UnderReview' | 'MoreInfoNeeded' | 'Approved' | 'Rejected';

/** Mirrors the backend OnboardingStatusResponse. */
export interface OnboardingStatus {
  tier: 'Sandbox' | 'Live';
  developerKycStatus: TrackStatus;
  businessKybStatus: TrackStatus;
  canIssueLiveKeys: boolean;
  submittedAtUtc: string | null;
  decidedAtUtc: string | null;
  decisionReason: string | null;
}

const STATUS_QUERY = ['onboarding-status'];

export function useOnboardingStatus() {
  return useQuery({
    queryKey: STATUS_QUERY,
    queryFn: ({ signal }) => getRequest<OnboardingStatus>({ url: API_ENDPOINTS.ONBOARDING.STATUS, signal }),
    staleTime: 60_000,
    retry: false,
  });
}

// ── Submission payloads (mirror the backend contracts) ─────────────────────
/** POST /onboarding/developer — SubmitDeveloperKycRequest */
export interface DeveloperKycInput {
  fullName: string;
  dateOfBirth: string;          // yyyy-MM-dd (DateOnly)
  country: string;
  address: string;
  idType: 'Bvn' | 'Nin';
  idNumber: string;             // 11 digits
  bankName: string;
  bankCode: string;
  bankAccountName: string;
  bankAccountNumber: string;
  portfolioUrl?: string;
  projectDescription?: string;
}

/** POST /onboarding/business — SubmitBusinessKybRequest */
export interface BusinessKybInput {
  legalName: string;
  registrationNumber: string;
  businessType: string;
  industry: string;
  country: string;
  address: string;
  contactCountryCode: string;
  contactPhone: string;
  website?: string;
  settlementBankName: string;
  settlementBankCode: string;
  settlementAccountName: string;
  settlementAccountNumber: string;
}

export type KycDocumentType = 'CertificateOfIncorporation' | 'ProofOfAddress';

// ── Mutations ──────────────────────────────────────────────────────────────
export function useSubmitDeveloperKyc() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['onboarding', 'developer'],
    mutationFn: async (input: DeveloperKycInput) => {
      const res = await postRequest<OnboardingStatus, DeveloperKycInput>({
        url: API_ENDPOINTS.ONBOARDING.DEVELOPER, payload: input,
      });
      return res;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: STATUS_QUERY }),
  });
}

export function useSubmitBusinessKyb() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['onboarding', 'business'],
    mutationFn: async (input: BusinessKybInput) => {
      const res = await postRequest<OnboardingStatus, BusinessKybInput>({
        url: API_ENDPOINTS.ONBOARDING.BUSINESS, payload: input,
      });
      return res;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: STATUS_QUERY }),
  });
}

export function useUploadKycDocument() {
  return useMutation({
    mutationKey: ['onboarding', 'documents'],
    mutationFn: async ({ type, file }: { type: KycDocumentType; file: File }) => {
      const form = new FormData();
      form.append('type', type);
      form.append('file', file);
      await postFormRequest<void>({ url: API_ENDPOINTS.ONBOARDING.DOCUMENTS, form });
    },
  });
}

export function useSubmitOnboarding() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['onboarding', 'submit'],
    mutationFn: async (attestationAccepted: boolean) => {
      const res = await postRequest<OnboardingStatus, { attestationAccepted: boolean }>({
        url: API_ENDPOINTS.ONBOARDING.SUBMIT, payload: { attestationAccepted },
      });
      return res;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: STATUS_QUERY }),
  });
}

/** Derive the dashboard banner state from onboarding status (null = no banner needed). */
export function onboardingBanner(s: OnboardingStatus | undefined) {
  if (!s || s.canIssueLiveKeys) return null;

  const both = [s.developerKycStatus, s.businessKybStatus];
  const anyRejected = both.includes('Rejected');
  const anyMoreInfo = both.includes('MoreInfoNeeded');
  const anyUnderReview = both.includes('UnderReview');
  const allNotStarted = both.every((x) => x === 'NotStarted');

  if (anyRejected)
    return { tone: 'error' as const, title: 'Your verification needs attention',
      body: s.decisionReason || 'One of your verification steps was declined. Please review and resubmit.' };
  if (anyMoreInfo)
    return { tone: 'warning' as const, title: 'We need a bit more information',
      body: s.decisionReason || 'Please provide the additional details requested to complete verification.' };
  if (anyUnderReview)
    return { tone: 'info' as const, title: 'Your account is under review',
      body: 'We’re reviewing your details. You can keep building in test mode — we’ll email you once you’re approved for live.' };
  if (allNotStarted)
    return { tone: 'warning' as const, title: 'Complete your profile to go live',
      body: 'You’re in test mode. Complete your developer KYC and business KYB to unlock live API keys and real payments.' };
  return { tone: 'warning' as const, title: 'Finish your verification to go live',
    body: 'You’re in test mode. Complete the remaining verification steps to unlock live API keys.' };
}
