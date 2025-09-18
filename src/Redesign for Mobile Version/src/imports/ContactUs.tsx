function ReachUs() {
  return (
    <div className="relative rounded-[18.432px] size-full" data-name="Reach Us!">
      <div className="absolute font-['PP_Editorial_New:Regular',_sans-serif] inset-[20%_19.86%_35%_17.02%] leading-[0] not-italic text-[22.118px] text-white">
        <p className="leading-[normal]">Reach Us!</p>
      </div>
    </div>
  );
}

function Frame64() {
  return (
    <div className="absolute box-border content-stretch flex gap-[10px] items-center justify-center left-0 p-[10px] top-0">
      <a className="[white-space-collapse:collapse] block font-['PP_Editorial_New:Regular',_sans-serif] leading-[0] not-italic relative shrink-0 text-[24px] text-black text-nowrap" href="mailto:exposure.explorers@nitgoa.ac.in">
        <p className="[text-underline-position:from-font] cursor-pointer decoration-solid leading-[normal] underline whitespace-pre">exposure.explorers@nitgoa.ac.in</p>
      </a>
    </div>
  );
}

function Frame65() {
  return (
    <div className="absolute h-[51px] left-[66px] top-[704px] w-[1393px]">
      <Frame64 />
      <div className="absolute font-['PP_Editorial_New:Regular',_sans-serif] leading-[0] left-[596px] not-italic text-[24px] text-black text-nowrap top-[13px]">
        <p className="leading-[normal] whitespace-pre">Instagram</p>
      </div>
      <div className="absolute font-['PP_Editorial_New:Regular',_sans-serif] leading-[0] left-[961px] not-italic text-[24px] text-black text-nowrap top-[13px]">
        <p className="leading-[normal] whitespace-pre">{`Linkedin `}</p>
      </div>
      <div className="absolute font-['PP_Editorial_New:Regular',_sans-serif] leading-[0] left-[1313px] not-italic text-[24px] text-black text-nowrap top-[13px]">
        <p className="leading-[normal] whitespace-pre">Youtube</p>
      </div>
    </div>
  );
}

export default function ContactUs() {
  return (
    <div className="bg-[#c9d5f7] min-h-screen px-6 py-8">
      <div className="mb-8">
        <h1 className="font-['EB_Garamond',_serif] italic text-[64px] text-black leading-none mb-4">Contact</h1>
        <div className="w-full h-[1px] bg-black mb-6"></div>
        <div className="text-center">
          <p className="font-['EB_Garamond',_serif] text-[24px] text-black leading-normal">Want help covering a event ?</p>
          <p className="font-['EB_Garamond',_serif] text-[24px] text-black leading-normal">Reach out using the form below!</p>
        </div>
      </div>

      <div className="space-y-8 mb-12">
        <div className="w-full">
          <label className="block font-['EB_Garamond',_serif] text-[20px] text-black mb-2">Your Name (or your Club's)</label>
          <div className="border-b border-black w-full h-[1px]"></div>
        </div>
        <div className="w-full">
          <label className="block font-['EB_Garamond',_serif] text-[20px] text-black mb-2">Phone</label>
          <div className="border-b border-black w-full h-[1px]"></div>
        </div>
        <div className="w-full">
          <label className="block font-['EB_Garamond',_serif] text-[20px] text-black mb-2">Email</label>
          <div className="border-b border-black w-full h-[1px]"></div>
        </div>
        <div className="w-full">
          <label className="block font-['EB_Garamond',_serif] text-[20px] text-black mb-2">What's the event about?</label>
          <div className="border-b border-black w-full h-[1px]"></div>
        </div>
        <div className="w-full">
          <label className="block font-['EB_Garamond',_serif] text-[20px] text-black mb-2">When's the Event?</label>
          <div className="border-b border-black w-full h-[1px]"></div>
        </div>

        <div className="flex justify-center pt-4">
          <div className="bg-[#112a46] rounded-[18px] px-6 py-3 w-full max-w-[140px] text-center">
            <span className="font-['EB_Garamond',_serif] text-[18px] text-white leading-normal">Reach Us!</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="text-center">
          <a href="mailto:exposure.explorers@nitgoa.ac.in" className="font-['EB_Garamond',_serif] text-[18px] text-black underline decoration-solid cursor-pointer">exposure.explorers@nitgoa.ac.in</a>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="font-['EB_Garamond',_serif] text-[18px] text-black">Instagram</div>
          <div className="font-['EB_Garamond',_serif] text-[18px] text-black">Linkedin</div>
          <div className="font-['EB_Garamond',_serif] text-[18px] text-black">Youtube</div>
        </div>
      </div>
    </div>
  );
}