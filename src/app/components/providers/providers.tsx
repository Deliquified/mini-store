"use client";

import { ReactNode } from "react";
import { UpProvider } from "./upProvider";
import { Toaster } from "sonner";
import { ApolloProvider } from '@apollo/client';
import { client } from '../apollo/apolloClient';
import { ProfileProvider } from "./profileProvider";
import { GridProvider } from "./gridProvider";
import { ThemeProvider } from "./themeProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <UpProvider>
      <ThemeProvider>
        <ApolloProvider client={client}>
          <ProfileProvider>
            <GridProvider>
              <Toaster />
              {children}
            </GridProvider>
          </ProfileProvider>
        </ApolloProvider>
      </ThemeProvider>
    </UpProvider>
  );
}