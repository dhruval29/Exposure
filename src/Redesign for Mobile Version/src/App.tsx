function ReachUsButton() {
  return (
    <button className="bg-[#112a46] rounded-[18px] px-6 py-3 w-full max-w-[140px] text-center">
      <span className="font-['EB_Garamond',_serif] text-[18px] text-white leading-normal">
        Reach Us!
      </span>
    </button>
  );
}

function FormField({ label, rightAligned = false }: { label: string; rightAligned?: boolean }) {
  return (
    <div className="w-full">
      <label className={`block font-['EB_Garamond',_serif] text-[20px] text-black mb-2 ${rightAligned ? 'text-right pr-4' : ''}`}>
        {label}
      </label>
      <div className="border-b border-black w-full h-[1px]"></div>
    </div>
  );
}

function SocialLink({ text, href }: { text: string; href?: string }) {
  return (
    <div className="text-center">
      {href ? (
        <a 
          href={href}
          className="font-['EB_Garamond',_serif] text-[18px] text-black underline decoration-solid cursor-pointer"
        >
          {text}
        </a>
      ) : (
        <span className="font-['EB_Garamond',_serif] text-[18px] text-black">
          {text}
        </span>
      )}
    </div>
  );
}

export default function ContactUs() {
  return (
    <div className="bg-[#c9d5f7] min-h-screen px-6 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="font-['EB_Garamond',_serif] italic text-[64px] text-black leading-none mb-4">
          Contact
        </h1>
        
        {/* Horizontal line */}
        <div className="w-full h-[1px] bg-black mb-6"></div>
        
        <div className="text-center">
          <p className="font-['EB_Garamond',_serif] text-[24px] text-black leading-normal">
            Want help covering a event ?
          </p>
          <p className="font-['EB_Garamond',_serif] text-[24px] text-black leading-normal">
            Reach out using the form below!
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="space-y-8 mb-12">
        <FormField label="Your Name (or your Club's)" />
        
        <FormField label="Phone" />
        
        <FormField label="Email" />
        
        <FormField label="What's the event about?" />
        
        <FormField label="When's the Event?" />
        
        {/* Submit Button */}
        <div className="flex justify-center pt-4">
          <ReachUsButton />
        </div>
      </div>

      {/* Footer Section */}
      <div className="space-y-6">
        <SocialLink 
          text="exposure.explorers@nitgoa.ac.in" 
          href="mailto:exposure.explorers@nitgoa.ac.in" 
        />
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <SocialLink text="Instagram" />
          <SocialLink text="Linkedin" />
          <SocialLink text="Youtube" />
        </div>
      </div>
    </div>
  );
}