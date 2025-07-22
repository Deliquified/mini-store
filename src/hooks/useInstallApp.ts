import { useState, useMemo } from 'react';
import { useGrid } from '@/app/components/providers/gridProvider';
import { toast } from 'sonner';
import { ERC725 } from '@erc725/erc725.js';
import { useUpProvider } from '@/app/components/providers/upProvider';
import { createPublicClient, http } from 'viem';
import { lukso } from 'viem/chains';
import { App } from "@/data/appCatalog";
import { uploadMetadataToIPFS } from './uploadMetadata';

export function useInstallApp() {
  const { sections, setSections } = useGrid();
  const { accounts, client: upClient } = useUpProvider();
  const [isInstalling, setIsInstalling] = useState(false);
  const [isUninstalling, setIsUninstalling] = useState(false);
  const [showGridSelection, setShowGridSelection] = useState(false);
  const [pendingApp, setPendingApp] = useState<App | null>(null);

  const checkIfInstalled = (app: App) => {
    return sections.some(section => 
      section.grid.some(item => 
        item.type === 'IFRAME' && 
        item.properties.src === app.app.url
      )
    );
  };

  const handleInstall = async (app: App) => {
    // Check if user is connected
    if (!accounts || accounts.length === 0 || !upClient) {
      toast("Connect your Universal Profile to install apps", {
        duration: 3000,
        position: "bottom-center",
        style: {
          background: "#dc2626",
          color: "#ffffff",
          border: "1px solid #dc2626"
        }
      });
      return;
    }

    if (checkIfInstalled(app)) {
      toast(`${app.app.name} is already installed`, {
        duration: 3000,
        position: "bottom-center",
        style: {
          background: "#303030",
          color: "#f0f0f0",
          border: "1px solid #303030"
        }
      });
      return;
    }

    // Show grid selection dialog
    setPendingApp(app);
    setShowGridSelection(true);
  };

  const installToGrid = async (app: App, gridIndex: number) => {
    setIsInstalling(true);

    try {
      // Create a copy of the current sections
      const updatedSections = [...sections];

      // Create the new grid item for the app
      const newGridItem = {
        type: 'IFRAME',
        width: app.app.defaultGridSize.width,
        height: app.app.defaultGridSize.height,
        properties: {
          src: app.app.url
        }
      };

      // Add the new grid item to the selected grid
      updatedSections[gridIndex].grid.push(newGridItem);

      // Wrap sections in the new LSP28TheGrid structure
      const gridData = {
        LSP28TheGrid: updatedSections
      };

      // Upload updated metadata to IPFS
      const metadataIpfsUrl = await uploadMetadataToIPFS(gridData);

      // Encode the data with LSP28TheGrid schema
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
          json: gridData,
          url: `ipfs://${metadataIpfsUrl.split('/ipfs/')[1]}`,
        },
      }]);

      // Make the transaction
      const txHash = await upClient?.writeContract({
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

      // Update UI immediately after transaction is submitted
      setSections(updatedSections);

      toast(`${app.app.name} installed successfully`, {
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
      console.error("Error installing app:", error);
      toast(`Failed to install ${app.app.name}`, {
        duration: 3000,
        position: "bottom-center",
        style: {
          background: "#303030",
          color: "#f0f0f0",
          border: "1px solid #303030"
        }
      });
    } finally {
      setIsInstalling(false);
    }
  };

  const handleGridSelect = (gridIndex: number) => {
    if (pendingApp) {
      installToGrid(pendingApp, gridIndex);
      setPendingApp(null);
    }
    setShowGridSelection(false);
  };

  const handleGridSelectionCancel = () => {
    setPendingApp(null);
    setShowGridSelection(false);
  };

  const handleUninstall = async (app: App) => {
    // Check if user is connected
    if (!accounts || accounts.length === 0 || !upClient) {
      toast("Connect your Universal Profile to uninstall apps", {
        duration: 3000,
        position: "bottom-center",
        style: {
          background: "#dc2626",
          color: "#ffffff",
          border: "1px solid #dc2626"
        }
      });
      return;
    }

    setIsUninstalling(true);

    try {
      // Create a copy of the current sections
      const updatedSections = sections
        .map(section => ({
          ...section,
          grid: section.grid.filter(item => 
            !(item.type === 'IFRAME' && 
              item.properties.src === app.app.url)
          )
        }))
        // Remove sections with empty grids
        .filter(section => section.grid.length > 0);

      // Wrap sections in the new LSP28TheGrid structure
      const gridData = {
        LSP28TheGrid: updatedSections
      };

      // Upload updated metadata to IPFS
      const metadataIpfsUrl = await uploadMetadataToIPFS(gridData);

      // Encode the data with LSP28TheGrid schema
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
          json: gridData,
          url: `ipfs://${metadataIpfsUrl.split('/ipfs/')[1]}`,
        },
      }]);

      // Make the transaction
      const txHash = await upClient?.writeContract({
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

      // Update UI immediately after transaction is submitted
      setSections(updatedSections);

      toast(`${app.app.name} uninstalled successfully`, {
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
      console.error("Error uninstalling app:", error);
      toast(`Failed to uninstall ${app.app.name}`, {
        duration: 3000,
        position: "bottom-center",
        style: {
          background: "#303030",
          color: "#f0f0f0",
          border: "1px solid #303030"
        }
      });
    } finally {
      setIsUninstalling(false);
    }
  };

  return { 
    handleInstall, 
    handleUninstall,
    isInstalling,
    isUninstalling,
    isInstalled: checkIfInstalled,
    showGridSelection,
    setShowGridSelection,
    pendingApp,
    handleGridSelect,
    handleGridSelectionCancel
  };
} 