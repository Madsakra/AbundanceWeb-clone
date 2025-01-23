

import { ForwardedRef } from "react";
import { FaImages } from "react-icons/fa";


type ImageSelector = {
    handleSvgClick:()=>void;
    fileInputRef:ForwardedRef<HTMLInputElement>;
    handleFileChange:(e: React.ChangeEvent<HTMLInputElement>)=>void;
}






export default function ImageSelector({handleFileChange,handleSvgClick,fileInputRef}:ImageSelector) {
  
  
  
    return (
                <div className="absolute bottom-0 right-3 top-0">
                {/* SVG or Image */}
                <div onClick={handleSvgClick} className="cursor-pointer rounded-full opacity-80 bg-black p-2" >
                  <FaImages size={20} color="white"/>
                </div>

                {/* Hidden File Input */}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }} // Hide the input
                />
              </div>
  )
}
