'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { referralsApi } from '@/lib/api';
import { ReferralListing, ReferralRequest } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { ReferralCard } from '@/components/referrals/ReferralCard';
import { RequestReferralModal } from '@/components/referrals/RequestReferralModal';
import {
  Award, ShieldCheck, Search, Plus, Filter,
  CheckCircle2, Clock, XCircle, ArrowRight, Sparkles, X
} from 'lucide-react';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

function ReferralsContent() {
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'browse' | 'my_requests' | 'incoming'>('browse');
  const [listings, setListings] = useState<ReferralListing[]>([]);
  const [myRequests, setMyRequests] = useState<ReferralRequest[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<ReferralRequest[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [selectedListing, setSelectedListing] = useState<ReferralListing | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isCreateListingOpen, setIsCreateListingOpen] = useState(false);

  // New Listing Form State
  const [newCompany, setNewCompany] = useState(user?.company || 'Google');
  const [newCategory, setNewCategory] = useState('Engineering & Cloud');
  const [newDescription, setNewDescription] = useState('');
  const [newReqs, setNewReqs] = useState('');

  const fetchListings = async () => {
    try {
      const data = await referralsApi.getListings({
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
      });
      if (data && data.length > 0) setListings(data);
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    }
  };

  const fetchMyRequests = async () => {
    try {
      const data = await referralsApi.getMyRequests();
      setMyRequests(data);
    } catch (error) {
      console.error("Failed to fetch my requests:", error);
    }
  };

  const fetchIncomingRequests = async () => {
    try {
      const data = await referralsApi.getIncomingRequests();
      setIncomingRequests(data);
    } catch (error) {
      console.error("Failed to fetch incoming requests:", error);
    }
  };

  useEffect(() => {
    fetchListings();
    if (user) {
      fetchMyRequests();
      if (user.role === 'employee' || user.is_verified_employee) {
        fetchIncomingRequests();
      }
    } else {
      setMyRequests([]);
      setIncomingRequests([]);
    }
  }, [selectedCategory, user]);

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.trim() || !newDescription.trim()) return;

    try {
      await referralsApi.createListing({
        company: newCompany,
        role_category: newCategory,
        description: newDescription,
        requirements_summary: newReqs,
        max_referrals_per_month: 5,
      });
      setIsCreateListingOpen(false);
      fetchListings();
    } catch {
      setIsCreateListingOpen(false);
    }
  };

  const handleReviewRequest = async (requestId: number, newStatus: string) => {
    try {
      await referralsApi.reviewRequest(requestId, newStatus, 'Approved and submitted internally.');
      fetchIncomingRequests();
    } catch {}
  };

  const filteredListings = listings.filter((l) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      l.company.toLowerCase().includes(q) ||
      l.role_category.toLowerCase().includes(q) ||
      l.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified Network Marketplace
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            Get Referred by Verified Employees
          </h1>
        </div>

        <button
          onClick={() => setIsCreateListingOpen(true)}
          className="px-4 py-2 rounded-xl bg-primary hover:opacity-90 text-primary-foreground text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Offer Referrals at My Company</span>
        </button>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-border pb-1">
        <button
          onClick={() => setActiveTab('browse')}
          className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer ${
            activeTab === 'browse'
              ? 'bg-card border-t border-x border-border text-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Browse Verified Referrers ({filteredListings.length})
        </button>

        <button
          onClick={() => setActiveTab('my_requests')}
          className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer ${
            activeTab === 'my_requests'
              ? 'bg-card border-t border-x border-border text-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          My Referral Requests ({myRequests.length})
        </button>

        {(user?.role === 'employee' || user?.is_verified_employee) && (
          <button
            onClick={() => setActiveTab('incoming')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer ${
              activeTab === 'incoming'
                ? 'bg-card border-t border-x border-border text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Incoming Candidate Requests ({incomingRequests.length})
          </button>
        )}
      </div>

      {/* TAB 1: BROWSE LISTINGS */}
      {activeTab === 'browse' && (
        <div className="space-y-6">
          {/* Filter / Search Bar */}
          <div className="p-4 rounded-2xl bg-card border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search company (Google, Stripe, Figma) or role category..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs outline-none focus:border-primary"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-auto p-2 rounded-xl border border-border bg-background text-foreground text-xs outline-none focus:border-primary cursor-pointer font-medium"
              >
                <option value="All">All Categories</option>
                <option value="Engineering">Engineering & Cloud</option>
                <option value="Design">Design & Product</option>
                <option value="Product">Product Management</option>
              </select>
            </div>
          </div>

          {/* Listings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <ReferralCard
                key={listing.id}
                listing={listing}
                onRequest={(l) => {
                  setSelectedListing(l);
                  setIsRequestModalOpen(true);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: MY REFERRAL REQUESTS */}
      {activeTab === 'my_requests' && (
        <div className="space-y-4">
          {myRequests.length === 0 ? (
            <div className="p-12 rounded-2xl border border-dashed border-border text-center text-xs text-muted-foreground space-y-2">
              <Award className="w-10 h-10 mx-auto text-muted-foreground/60" />
              <p>You haven't requested any referrals yet.</p>
              <button
                onClick={() => setActiveTab('browse')}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold cursor-pointer"
              >
                Browse Available Referrers
              </button>
            </div>
          ) : (
            myRequests.map((req) => (
              <div
                key={req.id}
                className="p-5 rounded-2xl border border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-foreground">{req.target_role_title}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        req.status === 'accepted' || req.status === 'submitted'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : req.status === 'declined'
                          ? 'bg-rose-500/10 text-rose-600'
                          : 'bg-amber-500/10 text-amber-600'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Target URL: <span className="font-mono text-foreground">{req.target_job_url || 'General Openings'}</span>
                  </p>

                  <p className="text-xs text-foreground italic bg-muted/40 p-2 rounded-lg border border-border/80 mt-1">
                    "{req.pitch}"
                  </p>

                  {req.reviewer_note && (
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 text-xs font-medium mt-2">
                      <strong>Referrer Feedback:</strong> {req.reviewer_note}
                    </div>
                  )}
                </div>

                <div className="text-right shrink-0 text-xs text-muted-foreground">
                  <div>Requested: {new Date(req.created_at).toLocaleDateString()}</div>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400 mt-1">{req.match_score}% Profile Match</div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: INCOMING REQUESTS (FOR EMPLOYEES) */}
      {activeTab === 'incoming' && (
        <div className="space-y-4">
          {incomingRequests.map((req) => (
            <div
              key={req.id}
              className="p-5 rounded-2xl border border-border bg-card space-y-3 shadow-xs"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={req.candidate?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt="Candidate"
                    className="w-10 h-10 rounded-full object-cover border border-border"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-foreground">{req.candidate?.full_name || 'Alex Rivera'}</h4>
                    <p className="text-xs text-muted-foreground">{req.target_role_title}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{req.match_score}% Match</span>
                  <span className="text-[10px] text-muted-foreground block">Verified Applicant</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-muted/30 border border-border text-xs text-foreground leading-relaxed">
                <strong className="text-primary">Candidate Pitch: </strong>
                <span>{req.pitch}</span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-border flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">
                  Earn +50 Karma when candidate referral is submitted
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReviewRequest(req.id, 'declined')}
                    className="px-3 py-1 rounded-lg border border-border text-muted-foreground hover:text-foreground text-xs font-semibold cursor-pointer"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => handleReviewRequest(req.id, 'submitted')}
                    className="px-4 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Submit Internal Referral</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <RequestReferralModal
        listing={selectedListing}
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSuccess={fetchMyRequests}
      />

      {/* Create Listing Modal */}
      {isCreateListingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-card w-full max-w-lg rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-border bg-muted/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-foreground">Offer Employee Referrals</h3>
              </div>
              <button onClick={() => setIsCreateListingOpen(false)} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateListing} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-foreground">Company Name</label>
                <input
                  type="text"
                  required
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  placeholder="e.g. Google, Stripe, Meta"
                  className="w-full p-2.5 rounded-xl border border-border bg-background text-foreground text-xs font-semibold outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-foreground">Role Department / Category</label>
                <input
                  type="text"
                  required
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="e.g. Engineering & Cloud, Product Design"
                  className="w-full p-2.5 rounded-xl border border-border bg-background text-foreground text-xs outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-foreground">Listing Description</label>
                <textarea
                  rows={3}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Tell candidates what roles you can refer for and what level of experience you are looking for..."
                  className="w-full p-3 rounded-xl border border-border bg-background text-foreground text-xs leading-relaxed outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-foreground">Requirements from Candidate</label>
                <input
                  type="text"
                  value={newReqs}
                  onChange={(e) => setNewReqs(e.target.value)}
                  placeholder="e.g. Include target job ID from company careers page & GitHub link"
                  className="w-full p-2.5 rounded-xl border border-border bg-background text-foreground text-xs outline-none focus:border-primary"
                />
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateListingOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border text-foreground hover:bg-accent font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary hover:opacity-90 text-primary-foreground font-bold shadow-md cursor-pointer"
                >
                  Publish Referral Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReferralsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-muted-foreground">Loading Referrals...</div>}>
      <ReferralsContent />
    </Suspense>
  );
}
