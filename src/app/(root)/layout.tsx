import { Navbar } from '@/components/auth/navbar';
import { AuthProvider } from '@/context/auth-context';
import React from 'react';

const RootLayout = ({children}:{children:React.ReactNode}) => {
    return (
        <div>
            <AuthProvider>
                  <Navbar />
                 {children}
            </AuthProvider>
           
        </div>
    );
};

export default RootLayout;