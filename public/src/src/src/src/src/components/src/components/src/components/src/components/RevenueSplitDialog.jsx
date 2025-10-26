```javascript
import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@radix-ui/react-button";
import { Input } from "@radix-ui/react-input";
import { authorizedCollaborators } from "../constants";

export default function RevenueSplitDialog({ open, onOpenChange, creators, editShares, setEditShares, setCreators, walletAddress, dao }) {
  function saveRevenueSplit() {
    const total = editShares.reduce((s, e) => {
      const share = parseFloat(e.share);
      return isNaN(share) ? s : s + share;
    }, 0);
    const normalized = editShares.map(e => {
      const share = parseFloat(e.share);
      return { ...e, share: total > 0 && !isNaN(share) ? Number((share / total).toFixed(4)) : 0 };
    });
    const change = { type: "revenueSplit", newCreators: normalized.map(n => ({ id: n.id, share: n.share })) };
    dao.submitChange(change, walletAddress);
    onOpenChange(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-800 p-6 rounded-lg max-w-md w-full">
          <Dialog.Title className="text-lg font-semibold mb-2">Adjust Revenue Split</Dialog.Title>
          <Dialog.Description className="text-sm text-white/70 mb-4">
            Set how payouts should be shared. Requires vote and approval.
          </Dialog.Description>
          <div className="space-y-3">
            {editShares.map(es => (
              <div key={es.id} className="flex items-center justify-between gap-3">
                <div className="w-2/3">
                  <div className="font-medium">{creators.find(c => c.id === es.id)?.name}</div>
                  <div className="text-xs text-white/60">{creators.find(c => c.id === es.id)?.role}</div>
                </div>
                <Input
                  value={es.share}
                  onChange={(e) => setEditShares(prev => prev.map(p => p.id === es.id ? { ...p, share: e.target.value } : p))}
                  className="w-1/3 bg-white/10 text-white p-2 rounded"
                  type="number"
                  step="0.01"
                  disabled={!walletAddress || !authorizedCollaborators.includes(walletAddress)}
                />
              </div>
            ))}
            <div className="flex justify-end gap-2 mt-4">
              <Button
                onClick={() => onOpenChange(false)}
                className="bg-transparent border border-white/20 text-white px-4 py-2 rounded hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                onClick={saveRevenueSplit}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                disabled={!walletAddress || !authorizedCollaborators.includes(walletAddress)}
              >
                Submit for Vote
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
