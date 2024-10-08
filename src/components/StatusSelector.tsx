import { IStatus } from "./ProjectCarusel";

interface IProps {
    selectStatus: number | string | null;
    setSelectStatus: React.Dispatch<{ selectStatus: number | null }>;
    statuses: IStatus[];
    updateStatus: (statusId: number) => Promise<void>;
}


const StatusSelector = (props: IProps) => {
    const {selectStatus, setSelectStatus, statuses, updateStatus} = props;
    
    return <>
        {selectStatus && <div className="bg-black opacity-45 z-20 fixed top-0 w-full h-full" onClick={() =>  setSelectStatus({selectStatus: null})}></div>}
        <div className={`${selectStatus ? "bottom-3" : "bottom-[-100%]"}  z-[100] fixed transition-all rounded-[25px] bg-white p-[12px] left-3 right-3 flex flex-col gap-2`}>
            {
                statuses?.length > 0 && statuses.map((status: IStatus) => (
                    <div
                    onClick={() => {
                        updateStatus(status.id)
                        setSelectStatus({selectStatus: null});
                    }}
                    key={status.id} className={`${status.id === selectStatus ? "bg-gray-100" : ""}  p-4 rounded-xl flex justify-between items-center`}>
                        <div className="flex gap-4">
                            <div className={status.id === selectStatus ? "text-gradient-blue" : ""}>{status.name}</div>
                        </div>
                        <div className={`${status.id === selectStatus ? "border-blue-500" : "border-gray-400"} flex justify-center items-center rounded border w-5 h-5`}>
                            {status.id === selectStatus && <div className="bg-custom-gradient-blue w-3 h-3 rounded-sm"></div> }
                        </div>
                    </div>
                ))
            }
        </div>
    </>
}
export default StatusSelector;