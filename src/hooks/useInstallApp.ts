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

  const checkIfInstalled = (app: App) => {
    return sections.some(section => 
      section.grid.some(item => 
        item.type === 'IFRAME' && 
        item.properties.src === app.appLink
      )
    );
  };

  const handleInstall = async (app: App) => {
    if (checkIfInstalled(app)) {
      toast(`${app.name} is already installed`, {
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

    setIsInstalling(true);

    try {
      // Create a copy of the current sections
      const updatedSections = [...sections];

      // Find the grid by developer name or create it if it doesn't exist
      let gridIndex = updatedSections.findIndex(section => section.title === app.developer);
      if (gridIndex === -1) {
        gridIndex = 0;
        updatedSections.unshift({
          title: app.developer,
          grid: [],
          gridColumns: 2
        });
      }

      // Create the new grid item for the app
      const newGridItem = {
        type: 'IFRAME',
        width: app.appSize.width,
        height: app.appSize.height,
        properties: {
          src: app.appLink
        }
      };

      // Add the new grid item to the grid
      updatedSections[gridIndex].grid.push(newGridItem);

      // Upload updated metadata to IPFS
      const metadataIpfsUrl = await uploadMetadataToIPFS(updatedSections);

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
          json: updatedSections,
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

      toast(`${app.name} installed successfully`, {
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
      toast(`Failed to install ${app.name}`, {
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

  const handleUninstall = async (app: App) => {
    setIsUninstalling(true);

    try {
      // Create a copy of the current sections
      const updatedSections = sections
        .map(section => ({
          ...section,
          grid: section.grid.filter(item => 
            !(item.type === 'IFRAME' && 
              item.properties.src === app.appLink)
          )
        }))
        // Remove sections with empty grids
        .filter(section => section.grid.length > 0);

      // Upload updated metadata to IPFS
      const metadataIpfsUrl = await uploadMetadataToIPFS(updatedSections);

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
          json: updatedSections,
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

      toast(`${app.name} uninstalled successfully`, {
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
      toast(`Failed to uninstall ${app.name}`, {
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
    isInstalled: checkIfInstalled
  };
} 