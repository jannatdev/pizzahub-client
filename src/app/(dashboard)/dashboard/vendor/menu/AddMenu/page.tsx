import AddMenuCard from '@/components/card/vendor/AddMenuCard';
import React from 'react';

const AddMenu = () => {
    return (
       <div className="mx-auto w-full max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Add Menu Item
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Create a new menu item and submit it for admin approval.
        </p>
      </div>

      <AddMenuCard />
    </div>
    );
};

export default AddMenu;