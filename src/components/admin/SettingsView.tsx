'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Loader2, Key } from 'lucide-react';
import { useEnrollMfa } from '@/api/admin';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';

export default function SettingsView() {
  const [qrCodeUri, setQrCodeUri] = useState<string | null>(null);
  const { mutate: enrollMfa, isPending } = useEnrollMfa();

  const handleEnrollMfa = () => {
    enrollMfa(undefined, {
      onSuccess: (data) => {
        if (data?.otpAuthUri) {
          setQrCodeUri(data.otpAuthUri);
          toast.success('MFA enrollment started. Please scan the QR code.');
        } else {
          toast.error('Failed to retrieve MFA URI.');
        }
      },
    });
  };

  return (
    <div className='flex flex-col gap-6 max-w-5xl mx-auto w-full'>
      <div>
        <h1 className='text-2xl font-bold text-foreground'>Account Settings</h1>
        <p className='text-sm text-xental-text-primary-400 mt-0.5'>
          Manage your personal admin account security and preferences.
        </p>
      </div>

      <div className='flex flex-col gap-6'>
        {/* Security Section */}
        <section className='bg-white rounded-2xl border border-stroke-2 overflow-hidden'>
          <div className='px-6 py-5 border-b border-stroke-2 flex items-center gap-3'>
            <div className='w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-action-blue'>
              <Shield className='w-5 h-5' />
            </div>
            <div>
              <h2 className='text-base font-bold text-foreground'>Security & MFA</h2>
              <p className='text-xs text-xental-text-primary-400'>Protect your account with Two-Factor Authentication</p>
            </div>
          </div>
          
          <div className='p-6 flex flex-col gap-6'>
            {!qrCodeUri ? (
              <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100'>
                <div className='flex flex-col gap-1'>
                  <span className='text-sm font-semibold text-foreground'>Two-Factor Authentication</span>
                  <span className='text-xs text-xental-text-primary-500'>Adds an extra layer of security to your admin account.</span>
                </div>
                <Button onClick={handleEnrollMfa} disabled={isPending} className='shrink-0 gap-2'>
                  {isPending ? <Loader2 className='w-4 h-4 animate-spin' /> : <Key className='w-4 h-4' />}
                  Enroll in MFA
                </Button>
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center py-6 gap-6 bg-slate-50 rounded-xl border border-slate-100'>
                <div className='text-center flex flex-col gap-2 max-w-md'>
                  <h3 className='text-base font-bold text-foreground'>Scan this QR Code</h3>
                  <p className='text-sm text-xental-text-primary-500'>
                    Open your authenticator app (like Google Authenticator or Authy) and scan this QR code to complete your MFA setup.
                  </p>
                </div>
                
                <div className='p-4 bg-white rounded-2xl shadow-sm border border-stroke-2'>
                  <QRCodeSVG value={qrCodeUri} size={200} />
                </div>
                
                <div className='bg-amber-50 border border-amber-200 text-amber-800 text-xs p-4 rounded-lg max-w-md text-center'>
                  <strong>Important:</strong> Do not refresh this page until you have successfully scanned the code and saved it in your app.
                </div>

                <Button variant='outline' onClick={() => setQrCodeUri(null)}>
                  Close
                </Button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
