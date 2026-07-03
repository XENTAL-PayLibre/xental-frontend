'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getRequest, postRequest, putRequest, deleteRequest } from '@/lib/http';
import { API_ENDPOINTS } from './api-endpoints';
import { displayError } from './auth';

export type TeamRole = 'Admin' | 'Employee' | 'Developer';
export type TeamMemberStatus = 'Invited' | 'Active' | 'Removed';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  status: TeamMemberStatus;
  createdAtUtc: string;
}

export interface TeamMemberInput {
  name: string;
  email: string;
  role: TeamRole;
}

const TEAM_QUERY = ['team'];

export function useTeam() {
  return useQuery({
    queryKey: TEAM_QUERY,
    queryFn: ({ signal }) => getRequest<TeamMember[]>({ url: API_ENDPOINTS.TEAM.BASE, signal }),
  });
}

export function useInviteTeamMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['team', 'invite'],
    mutationFn: async (input: TeamMemberInput) => {
      const res = await postRequest<TeamMember, TeamMemberInput>({ url: API_ENDPOINTS.TEAM.BASE, payload: input });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TEAM_QUERY });
      toast.success('Invitation sent');
    },
    onError: (error) => displayError(error, 'Could not send the invitation.', {
      409: 'Someone with this email is already on your team.',
    }),
  });
}

export function useUpdateTeamMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['team', 'update'],
    mutationFn: async ({ id, input }: { id: string; input: TeamMemberInput }) => {
      const res = await putRequest<TeamMember, TeamMemberInput>({ url: API_ENDPOINTS.TEAM.ONE(id), payload: input });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TEAM_QUERY });
      toast.success('Changes saved');
    },
    onError: (error) => displayError(error, 'Could not save changes.', {
      409: 'Someone with this email is already on your team.',
    }),
  });
}

export function useRemoveTeamMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['team', 'remove'],
    mutationFn: (id: string) => deleteRequest<void>({ url: API_ENDPOINTS.TEAM.ONE(id) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TEAM_QUERY });
      toast.success('Team member removed');
    },
    onError: (error) => displayError(error, 'Could not remove the team member.'),
  });
}

/** Anonymous: accept an invite by setting a password. */
export function useAcceptInvite() {
  return useMutation({
    mutationKey: ['team', 'accept'],
    mutationFn: (payload: { token: string; password: string }) =>
      postRequest<void, { token: string; password: string }>({ url: API_ENDPOINTS.TEAM.ACCEPT, payload }),
    onError: (error) => displayError(error, 'This invitation is invalid or has expired.', {
      400: 'This invitation is invalid or has expired.',
    }),
  });
}
