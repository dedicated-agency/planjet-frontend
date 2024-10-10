import { t } from "i18next";

const StoryPoint = ({
  openStoryPoint,
  setOpenStoryPoint,
  focusStoryPoint,
  setFocusStoryPoint,
  storyPoint,
  setStoryPoint,
  setSelectStoryPoint
}: any) => {
  return (
    <>
      {openStoryPoint && (
        <div
          className='bg-black opacity-45 z-10 fixed top-0 w-full h-full'
          onClick={() => {
            setOpenStoryPoint(false);
            setFocusStoryPoint(false);
          }}
        ></div>
      )}
      <div
        className={`${
          openStoryPoint
            ? focusStoryPoint
              ? "bottom-[30%]"
              : "bottom-3"
            : "bottom-[-100%]"
        }  z-[100] fixed transition-all rounded-[25px] bg-white px-3 py-5 left-3 pb-[80px] right-3 flex flex-wrap gap-2 justify-between`}
      >
        <div className='w-full h-[56px] py-[6px] px-[18px] bg-[#F2F2F7] rounded-[16px]'>
          <input
            type='number'
            placeholder='0'
            className='w-full h-full bg-transparent outline-none border-none'
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setStoryPoint(Number(e.target.value))
            }
            onFocus={() => setFocusStoryPoint(true)}
          />
        </div>
        <div>
          {openStoryPoint && (
            <div
              className=' absolute bottom-[22px] bg-custom-gradient-blue text-white flex justify-center items-center py-4 left-6 right-6 rounded-xl mt-3'
              onClick={() => {
                setFocusStoryPoint(false);
                setSelectStoryPoint(storyPoint);
                setOpenStoryPoint(false);
              }}
            >
              {t("save")}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StoryPoint;
