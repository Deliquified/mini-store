import { useState } from 'react';
import { useGrid } from '@/app/components/providers/gridProvider';
import { Trash2, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { ERC725 } from '@erc725/erc725.js';
import { useUpProvider } from '@/app/components/providers/upProvider';
import { createPublicClient, createWalletClient, http } from 'viem';
import { lukso } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { App } from "@/data/appCatalog";
import { uploadMetadataToIPFS } from '@/hooks/uploadMetadata';

interface MyAppsPageProps {
  onAppClick: (app: App) => void;
}

function getDomain(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function getPathAndQuery(url: string) {
  try {
    const u = new URL(url);
    return u.pathname + (u.search ? u.search : '');
  } catch {
    return '';
  }
}

function getFaviconUrl(url: string) {
  const domain = getDomain(url);
  return `https://www.google.com/s2/favicons?domain=${domain}`;
}

export default function MyAppsPage({ onAppClick }: MyAppsPageProps) {
  const { sections, setSections } = useGrid();
  const [selected, setSelected] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { accounts, client } = useUpProvider();

  // Flatten all IFRAME grid items from all sections
  const apps = sections
    .flatMap(section => section.grid)
    .filter(item => item.type === 'IFRAME' && item.properties.src)
    .map((item, index) => ({
      id: `${item.properties.src!}_${index}`,
      url: item.properties.src!,
      icon: getFaviconUrl(item.properties.src!),
      name: getDomain(item.properties.src!),
      path: getPathAndQuery(item.properties.src!),
      link: item.properties.src!
    }));

  const handleSelect = (appId: string) => {
    let newSelected;
    if (selected.includes(appId)) {
      newSelected = selected.filter(id => id !== appId);
    } else {
      newSelected = [...selected, appId];
    }
    setSelected(newSelected);
    setSelectionMode(newSelected.length > 0);
  };

  const handleCancel = () => {
    setSelected([]);
    setSelectionMode(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    setShowDeleteDialog(false);
    setIsDeleting(true);

    try {
      // Step 1: Prepare updated grid data
      const updatedSections = sections.map(section => ({
        ...section,
        grid: section.grid.filter(item => 
          !(item.type === 'IFRAME' && 
            item.properties.src && 
            selected.some(sel => sel.startsWith(item.properties.src!)))
        )
      }));

      // Create the metadata object
      const metadata = updatedSections;

      // Step 2: Upload to IPFS
      const metadataIpfsUrl = await uploadMetadataToIPFS(metadata);
      console.log("Updated grid metadata uploaded to IPFS:", metadataIpfsUrl);

      // Step 3: Encode the data with LSP28TheGrid schema
      const schema = [{
        name: 'LSP28TheGrid',
        key: '0x724141d9918ce69e6b8afcf53a91748466086ba2c74b94cab43c649ae2ac23ff',
        keyType: 'Singleton',
        valueType: 'bytes',
        valueContent: 'VerifiableURI'
      }];

      const erc725 = new ERC725(schema);

      // Encode metadata
      const encodedData = erc725.encodeData([{
        keyName: 'LSP28TheGrid',
        value: {
          json: metadata,
          url: `ipfs://${metadataIpfsUrl.split('/ipfs/')[1]}`,
        },
      }]);

      toast("Updating your grid...", {
        duration: 5000,
        position: "bottom-center",
        style: {
          background: "#303030",
          color: "#f0f0f0",
          border: "1px solid #303030"
        }
      });

      // Step 4: Make the transaction
      const txHash = await client?.writeContract({
        address: accounts[0] as `0x${string}`,
        abi: [{ 
          name: "setData",
          type: "function",
          inputs: [
            { name: "key", type: "bytes32" },
            { name: "value", type: "bytes" }
          ],
          outputs: [],
          stateMutability: "payable"
        }],
        functionName: "setData",
        args: [
          schema[0].key as `0x${string}`,
          encodedData.values[0] as `0x${string}`
        ],
        account: accounts[0],
        chain: lukso
      });

      let appCount = selected.length;

      // Update UI immediately after transaction is submitted
      setSections(updatedSections);
      setSelected([]);
      setSelectionMode(false);

      toast(`${appCount} app${appCount === 1 ? "" : "s"} uninstalled`, {
        duration: 3000,
        position: "bottom-center",
        style: {
          background: "#303030",
          color: "#f0f0f0",
          border: "1px solid #303030"
        }
      });

      // Check receipt in background
      const publicClient = createPublicClient({
        chain: lukso,
        transport: http(),
      });
      
      publicClient.waitForTransactionReceipt({ 
        hash: txHash as `0x${string}`
      }).then(receipt => {
        if (!receipt) {
          console.error("Transaction failed:", txHash);
        }
      }).catch(error => {
        console.error("Error checking transaction receipt:", error);
      });

    } catch (error) {
      let appCount = selected.length;
      console.error("Error removing apps:", error);
      toast(`Failed to remove ${appCount} app${appCount === 1 ? "" : "s"}`, {
        duration: 3000,
        position: "bottom-center",
        style: {
          background: "#303030",
          color: "#f0f0f0",
          border: "1px solid #303030"
        }
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExpand = (appId: string) => {
    setExpanded(expanded === appId ? null : appId);
  };

  return (
    <div className="bg-white flex flex-col w-full max-w-2xl mx-auto">
      {/* Top Bar */}
      <header className="sticky top-0 z-10 bg-white flex items-center py-4 border-b border-gray-200 min-h-[56px]">
        {selectionMode ? (
          <>
            <button 
              onClick={handleCancel} 
              className="mr-3 p-1 rounded-full hover:bg-gray-100"
              disabled={isDeleting}
            >
              <X className="w-6 h-6" />
            </button>
            <span className="font-medium text-base flex-1 h-8 flex items-center">
              {selected.length} selected
            </span>
            <button 
              onClick={handleDeleteClick}
              className="ml-auto p-1 rounded-full hover:bg-red-100 text-red-600 disabled:opacity-50"
              disabled={isDeleting}
            >
              <Trash2 className="w-6 h-6" />
            </button>
          </>
        ) : (
          <span className="font-semibold text-lg pl-2 h-8 flex items-center">Manage Apps</span>
        )}
      </header>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-xs p-0 bg-white rounded-lg overflow-hidden">
          <div className="px-6 pt-6 pb-4 text-center">
            <h2 className="text-[17px] font-normal text-gray-900 mb-2">
              Uninstall selected apps?
            </h2>
            <p className="text-[14px] text-gray-600">
              {selected.length} {selected.length === 1 ? 'app' : 'apps'} will be removed from your grid.
            </p>
          </div>
          <div className="flex border-t border-gray-100">
            <button
              className="flex-1 p-4 text-[14px] font-medium text-blue-600 hover:bg-gray-50 transition-colors"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              className="flex-1 p-4 text-[14px] font-medium text-red-500 hover:bg-gray-50 transition-colors disabled:opacity-50"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              Uninstall
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* App List */}
      <div className="flex-1 overflow-y-auto">
        {apps.map(app => (
          <div key={app.id}>
            <div
              className={`flex items-center py-4 px-2 transition-colors group ${expanded === app.id ? 'bg-gray-50' : ''}`}
              onClick={() => selectionMode && handleSelect(app.id)}
            >
              <div className="relative h-10 w-10 rounded-xl overflow-hidden mr-4 bg-gray-100 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={app.icon} alt={app.name} className="object-contain w-7 h-7" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-base truncate">{app.name}</div>
                <div className="text-xs text-gray-500 truncate">{app.path}</div>
              </div>
              <button
                className="ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                onClick={e => { e.stopPropagation(); handleExpand(app.id); }}
                aria-label={expanded === app.id ? 'Collapse' : 'Expand'}
              >
                {expanded === app.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              <input
                type="checkbox"
                checked={selected.includes(app.id)}
                onChange={e => handleSelect(app.id)}
                onClick={e => e.stopPropagation()}
                className="ml-4 w-5 h-5 accent-blue-600 rounded border-gray-300 cursor-pointer transition-colors"
              />
            </div>
            {expanded === app.id && (
              <div className="px-4 mx-0 mb-2 py-2 text-xs text-gray-700 select-all text-left bg-gray-50 transition-all duration-300 ease-in-out">
                {app.url}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}