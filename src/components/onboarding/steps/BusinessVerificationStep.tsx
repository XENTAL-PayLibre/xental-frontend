'use client';

import { useRef, useState } from 'react';
import { Upload, FileText, Trash2, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type FileStatus = 'uploading' | 'complete' | 'failed';

export interface UploadedFile {
  file: File;
  status: FileStatus;
  progress: number;
}

export interface BusinessVerificationData {
  certificate: UploadedFile | null;
  proofOfAddress: UploadedFile | null;
}

interface Props {
  data: BusinessVerificationData;
  onChange: (data: BusinessVerificationData) => void;
  onNext: () => void;
  onBack: () => void;
}

function UploadZone({
  label,
  hint,
  onFileSelect,
  disabled,
}: {
  label: string;
  hint: string;
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className='flex flex-col items-center gap-3 border border-dashed border-stroke-2 rounded-xl p-6 text-center bg-xental-bg'>
      <div className='w-10 h-10 rounded-full bg-action-blue-surface flex items-center justify-center'>
        <Upload className='w-5 h-5 text-action-blue' />
      </div>
      <div>
        <p className='text-sm font-medium text-foreground'>{label}</p>
        <p className='text-xs text-xental-text-primary-400 mt-0.5'>{hint}</p>
      </div>
      <button
        type='button'
        disabled={disabled}
        onClick={() => ref.current?.click()}
        className='text-xs border border-stroke-2 rounded-md px-3 py-1.5 text-xental-text-primary-500 hover:border-action-blue hover:text-action-blue transition-colors disabled:opacity-50'
      >
        Upload Files
      </button>
      <input
        ref={ref}
        type='file'
        accept='.pdf,.jpg,.jpeg,.png'
        className='hidden'
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFileSelect(f);
          e.target.value = '';
        }}
      />
    </div>
  );
}

function FileRow({
  label,
  status,
  progress,
  onRemove,
}: {
  label: string;
  status: FileStatus;
  progress: number;
  onRemove: () => void;
}) {
  return (
    <div className='rounded-lg border border-stroke-2 p-3'>
      <div className='flex items-center justify-between mb-2'>
        <div className='flex items-center gap-2'>
          <div className='w-7 h-7 rounded bg-xental-bg flex items-center justify-center'>
            <FileText className='w-4 h-4 text-xental-text-primary-400' />
          </div>
          <div>
            <p className='text-xs font-medium text-foreground'>{label}</p>
            <p
              className={cn('text-[10px] flex items-center gap-1', {
                'text-action-blue': status === 'uploading',
                'text-success': status === 'complete',
                'text-destructive': status === 'failed',
              })}
            >
              {status === 'uploading' && 'Uploading...'}
              {status === 'complete' && (
                <>
                  <CheckCircle className='w-3 h-3' /> Complete
                </>
              )}
              {status === 'failed' && 'Failed'}
            </p>
          </div>
        </div>
        <button
          onClick={onRemove}
          className='text-xental-text-primary-400 hover:text-destructive transition-colors'
        >
          {status === 'failed' ? (
            <X className='w-4 h-4' />
          ) : (
            <Trash2 className='w-4 h-4 text-destructive/70' />
          )}
        </button>
      </div>
      <div className='h-0.5 w-full bg-stroke-2 rounded-full overflow-hidden'>
        <div
          className={cn('h-full rounded-full transition-all duration-500', {
            'bg-action-blue': status === 'uploading',
            'bg-success': status === 'complete',
            'bg-destructive': status === 'failed',
          })}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default function BusinessVerificationStep({ data, onChange, onNext, onBack }: Props) {
  const [uploading, setUploading] = useState(false);

  const simulateUpload = (file: File, key: 'certificate' | 'proofOfAddress') => {
    const newFile: UploadedFile = { file, status: 'uploading', progress: 0 };
    onChange({ ...data, [key]: newFile });

    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      if (progress >= 100) {
        clearInterval(interval);
        onChange({ ...data, [key]: { file, status: 'complete', progress: 100 } });
        setUploading(false);
      } else {
        onChange({ ...data, [key]: { file, status: 'uploading', progress } });
      }
    }, 300);
    setUploading(true);
  };

  const remove = (key: 'certificate' | 'proofOfAddress') =>
    onChange({ ...data, [key]: null });

  const isDone =
    data.certificate?.status === 'complete' && data.proofOfAddress?.status === 'complete';

  const canProceed = isDone;

  return (
    <div>
      <h2 className='text-xl font-bold text-foreground mb-1'>Business documents</h2>
      <p className='text-sm text-xental-text-primary-400 mb-6'>
        To ensure the security of our platform and comply with financial regulations, please provide
        the following documents
      </p>

      {(!data.certificate || !data.proofOfAddress) && (
        <div className='grid grid-cols-2 gap-4 mb-4'>
          {!data.certificate && (
            <UploadZone
              label='Certificate of Incorporation'
              hint='PDF, JPG or PNG (max 10MB)'
              onFileSelect={(f) => simulateUpload(f, 'certificate')}
              disabled={uploading}
            />
          )}
          {!data.proofOfAddress && (
            <UploadZone
              label='Proof of Address'
              hint='PDF, JPG or PNG (max 10MB)'
              onFileSelect={(f) => simulateUpload(f, 'proofOfAddress')}
              disabled={uploading}
            />
          )}
        </div>
      )}

      {isDone && (
        <div className='grid grid-cols-2 gap-4 mb-4'>
          {[
            { label: data.certificate?.file.name ?? 'Certificate.pdf', key: 'certificate' as const },
            { label: data.proofOfAddress?.file.name ?? 'Proof of Address.pdf', key: 'proofOfAddress' as const },
          ].map(({ label, key }) => (
            <div key={key} className='border border-stroke-2 rounded-xl overflow-hidden'>
              <div className='flex items-center justify-between px-3 py-2 border-b border-stroke-2'>
                <span className='text-xs font-medium text-foreground truncate'>{label}</span>
                <button onClick={() => remove(key)} className='text-destructive/70 hover:text-destructive ml-2'>
                  <Trash2 className='w-3.5 h-3.5' />
                </button>
              </div>
              <div className='h-24 bg-xental-bg flex items-center justify-center'>
                <FileText className='w-8 h-8 text-xental-text-primary-400' />
              </div>
            </div>
          ))}
        </div>
      )}

      {(data.certificate || data.proofOfAddress) && !isDone && (
        <div className='flex flex-col gap-2 mb-4'>
          {data.certificate && (
            <FileRow
              label={data.certificate.file.name}
              status={data.certificate.status}
              progress={data.certificate.progress}
              onRemove={() => remove('certificate')}
            />
          )}
          {data.proofOfAddress && (
            <FileRow
              label={data.proofOfAddress.file.name}
              status={data.proofOfAddress.status}
              progress={data.proofOfAddress.progress}
              onRemove={() => remove('proofOfAddress')}
            />
          )}
        </div>
      )}

      <p className='text-xs text-xental-text-primary-400 mt-2'>
        Documents are encrypted and stored securely. Verification typically takes 1 to 2 business
        days. You will be notified via email once the review is complete.
      </p>

      <div className='flex items-center justify-between mt-8'>
        <button
          onClick={onBack}
          className='text-sm text-xental-text-primary-500 hover:text-foreground transition-colors'
        >
          Back
        </button>
        <Button onClick={onNext} className='px-8' disabled={!canProceed}>
          Next
        </Button>
      </div>
    </div>
  );
}
