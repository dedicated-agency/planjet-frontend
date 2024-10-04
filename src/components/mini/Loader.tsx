import { useContext } from 'react';
import './loader.css';
import { StateContext } from '../../context/StateContext';
import languages from '../../local/languages.json'
export const Loader = () => {
    const {lang} = useContext(StateContext);
    const locales: any = languages;
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
        <p className='mt-2 text-slate-500 text-sm'>{locales[lang].loading}</p>
    </div>
}