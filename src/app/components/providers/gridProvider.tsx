'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { ERC725 } from '@erc725/erc725.js';
import { useUpProvider } from "./upProvider";

const RPC_ENDPOINT = 'https://42.rpc.thirdweb.com';
const IPFS_GATEWAY = 'https://api.universalprofile.cloud/ipfs';

// Define LSP28TheGrid schema locally
const lsp28schema = [
  {
    "name": "LSP28TheGrid",
    "key": "0x724141d9918ce69e6b8afcf53a91748466086ba2c74b94cab43c649ae2ac23ff",
    "keyType": "Singleton",
    "valueType": "bytes",
    "valueContent": "VerifiableURI"
  }
];

// LSP28TheGrid interfaces
interface GridItemProperties {
  src?: string;
  title?: string;
  titleColor?: string;
  text?: string;
  textColor?: string;
  backgroundColor?: string;
  link?: string;
  images?: string[];
  type?: string;
  username?: string;
  id?: string;
  theme?: string;
  language?: string;
  donottrack?: boolean;
  data?: string;
  allow?: string;
  sandbox?: string;
  allowfullscreen?: boolean;
  referrerpolicy?: string;
}

interface GridItem {
  width: number;
  height: number;
  type: string;
  properties: GridItemProperties;
}

interface GridSection {
  title: string;
  gridColumns: number;
  grid: GridItem[];
  visibility?: "public" | "private";
  isPrivate?: boolean; // Legacy property for backward compatibility
}

interface GridData {
  sections: GridSection[];
  isLoading: boolean;
  error: string | null;
  setSections: (sections: GridSection[]) => void;
}

// ERC725 Response interfaces
interface VerifiableURI {
  verification: {
    method: string;
    data: string;
  };
  url: string;
}

const GridContext = createContext<GridData | undefined>(undefined);

export function useGrid() {
  const context = useContext(GridContext);
  if (!context) {
    throw new Error("useGrid must be used within a GridProvider");
  }
  return context;
}

export function GridProvider({ children }: { children: ReactNode }) {
  const { accounts, walletConnected } = useUpProvider();
  const [sections, setSections] = useState<GridSection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGridData() {
      if (!walletConnected || !accounts[0]) {
        console.log('GridProvider: Not fetching - walletConnected:', walletConnected, 'accounts:', accounts);
        return;
      }

      console.log('GridProvider: Starting fetch for account:', accounts[0]);
      setIsLoading(true);
      setError(null);

      try {
        // Create ERC725 instance
        const erc725js = new ERC725(
          lsp28schema, 
          accounts[0], 
          RPC_ENDPOINT, 
          { ipfsGateway: IPFS_GATEWAY }
        );

        // Fetch LSP28TheGrid data
        const fetchedData = await erc725js.getData('LSP28TheGrid');
        console.log('GridProvider: Fetched raw data:', fetchedData);

        if (fetchedData && fetchedData.value) {
          // Check if value is a VerifiableURI object
          const value = fetchedData.value as VerifiableURI;
          console.log('GridProvider: Processed value:', value);
          
          // For VerifiableURI content, the value contains a URL to the grid data
          // We need to fetch the actual data from the URL
          if (value.url && typeof value.url === 'string' && value.url.startsWith('ipfs://')) {
            const ipfsHash = value.url.replace('ipfs://', '');
            const ipfsUrl = `${IPFS_GATEWAY}/${ipfsHash}`;
            console.log('GridProvider: Fetching from IPFS URL:', ipfsUrl);
            
            const response = await fetch(ipfsUrl);
            if (!response.ok) {
              throw new Error(`Failed to fetch grid data from IPFS: ${response.status} ${response.statusText}`);
            }
            
            const gridData = await response.json();
            console.log('GridProvider: Grid data from IPFS:', gridData);
            
            // Check if gridData is an array (for backward compatibility)
            if (Array.isArray(gridData)) {
              console.log('GridProvider: Setting sections from array:', gridData);
              setSections(gridData);
            } 
            // Or if it has LSP28TheGrid property
            else if (gridData && gridData.LSP28TheGrid) {
              const theGrid = gridData.LSP28TheGrid;
              console.log('GridProvider: Found LSP28TheGrid property:', theGrid);
              // Check if LSP28TheGrid is an array or a single section
              if (Array.isArray(theGrid)) {
                console.log('GridProvider: Setting sections from LSP28TheGrid array:', theGrid);
                setSections(theGrid);
              } else {
                console.log('GridProvider: Setting sections from single LSP28TheGrid object:', [theGrid]);
                setSections([theGrid]);
              }
            } else {
              console.error('GridProvider: Invalid grid data format:', gridData);
              setError('Invalid grid data format');
              setSections([]);
            }
          } else {
            console.error('GridProvider: Invalid or missing IPFS URL:', value);
            setError('Invalid IPFS URL in grid data');
            setSections([]);
          }
        } else {
          console.log('GridProvider: No grid data found in response');
          setError('No grid data found');
          setSections([]);
        }
      } catch (err) {
        console.error('GridProvider: Error fetching grid data:', err);
        setError('Failed to load grid data');
        setSections([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchGridData();
  }, [walletConnected, accounts]);

  return (
    <GridContext.Provider value={{ sections, isLoading, error, setSections }}>
      {children}
    </GridContext.Provider>
  );
}