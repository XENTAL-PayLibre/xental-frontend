'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, MoreVertical } from 'lucide-react';
import CreateAdminModal from './CreateAdminModal';
import { Pagination } from '@/components/ui/Pagination';
import { useListAdmins } from '@/api/admin';

export default function AdminsView() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const { data: admins = [], isLoading } = useListAdmins();

  const paginatedAdmins = admins.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(admins.length / PAGE_SIZE));

  return (
    <div className='flex flex-col gap-5'>
      <div className='flex flex-col sm:flex-row sm:items-start justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-foreground'>Internal Admin Management</h1>
          <p className='text-sm text-xental-text-primary-400 mt-0.5'>
            Manage system access and privileges for Xental operators.
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className='gap-2 shrink-0'>
          <Plus className='w-4 h-4' /> Create New Admin
        </Button>
      </div>

      <div className='rounded-2xl border border-stroke-2 bg-white flex flex-col mt-4 overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-xs'>
            <thead>
              <tr className='border-b border-stroke-2 bg-xental-bg/30'>
                <th className='text-left px-6 py-4 font-semibold text-xental-text-primary-400 uppercase tracking-wider text-[10px] w-1/4'>Name</th>
                <th className='text-left px-6 py-4 font-semibold text-xental-text-primary-400 uppercase tracking-wider text-[10px] w-1/4'>Email</th>
                <th className='text-left px-6 py-4 font-semibold text-xental-text-primary-400 uppercase tracking-wider text-[10px] w-1/6'>Role</th>
                <th className='text-left px-6 py-4 font-semibold text-xental-text-primary-400 uppercase tracking-wider text-[10px] w-1/6'>Last Login</th>
                <th className='text-left px-6 py-4 font-semibold text-xental-text-primary-400 uppercase tracking-wider text-[10px]'>Status</th>
                <th className='text-right px-6 py-4 font-semibold text-xental-text-primary-400 uppercase tracking-wider text-[10px]'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className='border-b border-stroke-2'>
                    {Array.from({ length: 6 }).map((__, j) => (
                      <td key={j} className='px-6 py-4'>
                        <div className='h-3 bg-xental-bg rounded animate-pulse w-20' />
                      </td>
                    ))}
                  </tr>
                ))
              ) : paginatedAdmins.length === 0 ? (
                <tr>
                  <td colSpan={6} className='px-6 py-10 text-center text-xental-text-primary-400'>
                    No admin accounts found.
                  </td>
                </tr>
              ) : (
                paginatedAdmins.map((admin) => (
                  <tr key={admin.id} className='border-b border-stroke-2 last:border-0 hover:bg-xental-bg/50 transition-colors'>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        <div className='w-8 h-8 rounded-full bg-action-blue flex items-center justify-center text-white font-semibold shrink-0'>
                          {admin.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                        <span className='font-semibold text-sm'>{admin.name}</span>
                      </div>
                    </td>
                    <td className='px-6 py-4 text-xental-text-primary-500 font-medium'>
                      {admin.email}
                    </td>
                    <td className='px-6 py-4'>
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                        admin.role === 'SuperAdmin'
                          ? 'bg-amber-100 text-amber-800 border-amber-200 border'
                          : 'bg-blue-100 text-blue-800 border-blue-200 border'
                      }`}>
                        {admin.role}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-xental-text-primary-400 font-mono text-[11px]'>
                      {admin.lastLogin}
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-2'>
                        <div className={`w-2 h-2 rounded-full ${admin.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        <span className='font-medium text-xs text-xental-text-primary-500'>{admin.status}</span>
                      </div>
                    </td>
                    <td className='px-6 py-4 text-right'>
                      <button className='p-1 text-xental-text-primary-400 hover:text-foreground rounded transition-colors'>
                        <MoreVertical className='w-4 h-4' />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className='p-4 border-t border-stroke-2 flex items-center justify-between'>
          <span className='text-xs text-xental-text-primary-400'>
            {admins.length > 0
              ? `Showing ${(page - 1) * PAGE_SIZE + 1} to ${Math.min(page * PAGE_SIZE, admins.length)} of ${admins.length} admins`
              : 'No admins'}
          </span>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={admins.length}
            onPageChange={setPage}
          />
        </div>
      </div>

      <CreateAdminModal open={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
}
