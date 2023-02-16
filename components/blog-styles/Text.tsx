import React from "react";

type props = {
  children: React.ReactNode;
};

const Text = ({ children }: props) => {
  return (
    <p className="text-base md:text-lg lg:text-xl font-normal md:font-medium opacity-80 leading-[1.3] md:leading-[1.5] lg:leading-[2] mb-8 mt-4">
      {children}
    </p>
  );
};

export default Text;
