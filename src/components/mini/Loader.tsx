import { t } from 'i18next';
import './loader.css';
export const Loader = () => {
    return <div className='w-full h-[100%] min-h-[80vh] flex flex-col justify-center items-center'>
        <div className="overlay">
            <div className="ispinner gray center">
                <div className="ispinner-blade"></div>
                <div className="ispinner-blade"></div>
                <div className="ispinner-blade"></div>
                <div className="ispinner-blade"></div>
                <div className="ispinner-blade"></div>
                <div className="ispinner-blade"></div>
                <div className="ispinner-blade"></div>
                <div className="ispinner-blade"></div>
                <div className="ispinner-blade"></div>
                <div className="ispinner-blade"></div>
                <div className="ispinner-blade"></div>
                <div className="ispinner-blade"></div>
            </div>
        </div>
        <p className='mt-2 text-slate-500 text-sm'>{t('loading')}</p>
    </div>
}