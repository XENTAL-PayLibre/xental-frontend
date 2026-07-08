'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, XCircle, MessageSquare, FileText, Download, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAdminTenantDetails, useReviewAction } from '@/api/admin';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Modal from '@/components/ui/Modal';

export default function OnboardingDetailView({ tenantId }: { tenantId: string }) {
  const router = useRouter();
  const { data: detail, isLoading } = useAdminTenantDetails(tenantId);
  const { mutate: performAction, isPending } = useReviewAction();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'approve' | 'reject' | 'request-info'>('reject');
  const [reason, setReason] = useState('');
  const [track, setTrack] = useState<'DeveloperKyc' | 'BusinessKyb' | ''>('');

  const handleOpenModal = (type: 'approve' | 'reject' | 'request-info') => {
    setModalType(type);
    setReason('');
    setTrack('');
    setModalOpen(true);
  };

  const submitModalAction = () => {
    if (modalType !== 'approve' && !reason.trim()) return alert('Reason is required');
    performAction({ tenantId, action: modalType, payload: { reason, track } }, {
      onSuccess: () => {
        setModalOpen(false);
        router.push('/admin/onboarding');
      }
    });
  };

  const getModalConfig = () => {
    if (modalType === 'approve') return { title: 'Approve Application', desc: 'Add an optional internal note or reason for this approval.', btnClass: 'bg-emerald-600 hover:bg-emerald-700 text-white', btnText: 'Confirm Approval' };
    if (modalType === 'reject') return { title: 'Reject Application', desc: 'Please provide a reason for this rejection. This will be visible to the merchant.', btnClass: 'bg-red-600 hover:bg-red-700 text-white', btnText: 'Reject' };
    return { title: 'Request Additional Information', desc: 'Specify what additional info is required. This will be sent to the merchant.', btnClass: 'bg-amber-600 hover:bg-amber-700 text-white', btnText: 'Send Request' };
  };

  const modalConfig = getModalConfig();

  if (isLoading) {
    return <div className="p-8 text-center text-muted">Loading tenant details...</div>;
  }

  if (!detail) {
    return <div className="p-8 text-center text-muted">Application not found.</div>;
  }


  return (
    <div className='flex flex-col gap-5'>
      {/* Header */}
      <div className='flex flex-col gap-3'>
        <button
          onClick={() => router.back()}
          className='flex items-center gap-2 text-sm text-xental-text-primary-400 hover:text-foreground transition-colors w-fit'
        >
          <ArrowLeft className='w-4 h-4' />
          Back to onboarding
        </button>
        <h1 className='text-2xl font-bold text-foreground'>Application Details</h1>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Detail Body (Left - 2/3) */}
        <div className='md:col-span-2 flex flex-col gap-6'>
          
          {/* Summary Section */}
          <div className='rounded-2xl border border-stroke-2 bg-white p-6'>
            <h2 className='text-base font-semibold mb-4'>Business Information</h2>
            <div className='grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4'>
              <div>
                <p className='text-xs text-xental-text-primary-400 mb-1'>Email</p>
                <p className='text-sm font-medium'>{detail.summary.tenantEmail}</p>
              </div>
              <div>
                <p className='text-xs text-xental-text-primary-400 mb-1'>Tier</p>
                <p className='text-sm font-medium capitalize'>{detail.summary.tier}</p>
              </div>
              <div>
                <p className='text-xs text-xental-text-primary-400 mb-1'>Submitted</p>
                <p className='text-sm font-medium'>
                  {detail.summary.submittedAtUtc && new Date(detail.summary.submittedAtUtc).getFullYear() > 1970 
                    ? new Date(detail.summary.submittedAtUtc).toLocaleString() 
                    : '—'}
                </p>
              </div>
              <div>
                <p className='text-xs text-xental-text-primary-400 mb-1'>KYC Status</p>
                <StatusBadge status={detail.summary.developerKycStatus} />
              </div>
              <div>
                <p className='text-xs text-xental-text-primary-400 mb-1'>KYB Status</p>
                <StatusBadge status={detail.summary.businessKybStatus} />
              </div>
            </div>
          </div>

          {/* Automated Checks Section */}
          <div className='rounded-2xl border border-stroke-2 bg-white p-6'>
            <h2 className='text-base font-semibold mb-4'>Automated Checks</h2>
            <div className='flex flex-col gap-4'>
              {detail.checks.length === 0 && <p className='text-sm text-muted'>No checks ran.</p>}
              {detail.checks.map((check, i) => (
                <div key={i} className='flex items-start gap-3 p-4 rounded-xl bg-xental-bg/50 border border-stroke-2'>
                  {check.outcome === 'Passed' ? (
                    <ShieldCheck className='w-5 h-5 text-emerald-500 mt-0.5' />
                  ) : (
                    <AlertCircle className='w-5 h-5 text-amber-500 mt-0.5' />
                  )}
                  <div className='flex-1'>
                    <div className='flex justify-between items-start mb-1'>
                      <h3 className='text-sm font-semibold'>{check.kind}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${check.outcome === 'Passed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {check.outcome}
                      </span>
                    </div>
                    <p className='text-xs text-xental-text-primary-400 mb-1'>Provider: {check.provider}</p>
                    <p className='text-xs'>{check.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Actions & Documents Panel (Right - 1/3) */}
        <div className='flex flex-col gap-6'>
          
          {/* Review Actions */}
          <div className='rounded-2xl border border-stroke-2 bg-white p-6'>
            <h2 className='text-base font-semibold mb-4'>Review Actions</h2>
            <div className='flex flex-col gap-3'>
              <Button 
                onClick={() => handleOpenModal('approve')} 
                disabled={isPending}
                className='w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2'
              >
                <CheckCircle className='w-4 h-4' />
                Approve Account
              </Button>
              
              <Button 
                onClick={() => handleOpenModal('request-info')} 
                disabled={isPending}
                variant='outline'
                className='w-full border-amber-500 text-amber-600 hover:bg-amber-50 gap-2'
              >
                <MessageSquare className='w-4 h-4' />
                Request Info
              </Button>

              <Button 
                onClick={() => handleOpenModal('reject')} 
                disabled={isPending}
                variant='outline'
                className='w-full border-red-500 text-red-600 hover:bg-red-50 gap-2'
              >
                <XCircle className='w-4 h-4' />
                Reject Account
              </Button>
            </div>
          </div>

          {/* Documents */}
          <div className='rounded-2xl border border-stroke-2 bg-white p-6'>
            <h2 className='text-base font-semibold mb-4'>Submitted Documents</h2>
            <div className='flex flex-col gap-3'>
              {detail.documents.length === 0 && <p className='text-sm text-muted'>No documents attached.</p>}
              {detail.documents.map((doc, i) => (
                <div key={i} className='flex items-center justify-between p-3 rounded-lg border border-stroke-2'>
                  <div className='flex items-center gap-3 overflow-hidden'>
                    <div className='p-2 bg-xental-bg rounded'>
                      <FileText className='w-4 h-4 text-xental-text-primary-400' />
                    </div>
                    <div className='flex flex-col truncate'>
                      <span className='text-xs font-medium truncate'>{doc.type}</span>
                      <span className='text-[10px] text-xental-text-primary-400'>{doc.reviewStatus}</span>
                    </div>
                  </div>
                  <a 
                    href={doc.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className='p-2 text-action-blue hover:bg-xental-bg rounded-full transition-colors'
                  >
                    <Download className='w-4 h-4' />
                  </a>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Modal for Actions */}
      <Modal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)}
        title={modalConfig.title}
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-xental-text-primary-400">
            {modalConfig.desc}
          </p>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Track</label>
            <select
              value={track}
              onChange={(e) => setTrack(e.target.value as 'DeveloperKyc' | 'BusinessKyb' | '')}
              className="w-full rounded-lg border border-stroke-2 bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:border-action-blue"
            >
              <option value="" disabled>Select a track</option>
              <option value="DeveloperKyc">Developer KYC</option>
              <option value="BusinessKyb">Business KYB</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Reason / Note</label>
            <textarea 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter a detailed reason..."
              className="w-full min-h-[120px] rounded-lg border border-stroke-2 bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:border-action-blue resize-y"
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button 
              onClick={submitModalAction} 
              disabled={isPending || !track || (modalType !== 'approve' && !reason.trim())}
              className={modalConfig.btnClass}
            >
              {modalConfig.btnText}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
