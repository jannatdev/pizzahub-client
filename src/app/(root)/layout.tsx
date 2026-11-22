import { Navbar } from '@/components/auth/navbar';
import Footer from '@/components/homepage/footer';
import { AuthProvider } from '@/context/auth-context';
import React from 'react';

const RootLayout = ({children}:{children:React.ReactNode}) => {
    return (
        <div>
            <AuthProvider>
                  <Navbar />
                 {children}
                 <Footer></Footer>
            </AuthProvider>
           
        </div>
    );
};

export default RootLayout;