import { motion } from "motion/react"


type ContactInfoProps = {
    mapSrc: string; // URL for the embedded map
    address: string;
    openingHours: string;
    phone: string;
    email: string;
  };
  

export default function ContactInfo({mapSrc,address,openingHours,phone,email}:ContactInfoProps) {
  return (
    <motion.div 
    initial={{opacity:0, y: 80}}
    whileInView={{opacity:1, y:0, transition:{delay: 0.2 ,duration: 0.4}}}
    viewport={{once:false,amount:0.4}}

    className="flex flex-col-reverse md:flex-row gap-8 lg:gap-16 items-center self-center mt-10 mb-36"
    >
      {/* Embedded Google Map */}
      <div className="w-full lg:w-[50vw]  h-[60vh]">
        <iframe
          src={mapSrc}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      {/* Contact Information */}
      <div className="w-full md:w-1/2 space-y-4">
        <h2 className="text-5xl font-bold text-teal-600">Abundance</h2>
        <p className="text-lg">{address}</p>
        <p className="text-lg">Opening hours: {openingHours}</p>
        <div className="flex items-center space-x-2">
          <span role="img" aria-label="Phone">
            📞
          </span>
          <p className="text-lg">{phone}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span role="img" aria-label="Email">
            📧
          </span>
          <p className="text-lg">{email}</p>
        </div>
      </div>
    </motion.div>
  )
}
