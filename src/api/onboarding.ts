'use client';

import { useQuery } from '@tanstack/react-query';
import { getRequest } from '@/lib/http';
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

export function useOnboardingStatus() {
  return useQuery({
    queryKey: ['onboarding-status'],
    queryFn: ({ signal }) => getRequest<OnboardingStatus>({ url: API_ENDPOINTS.ONBOARDING.STATUS, signal }),
    staleTime: 60_000,
    retry: false,
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
