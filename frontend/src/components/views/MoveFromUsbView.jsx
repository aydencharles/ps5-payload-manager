import React, { useState, useEffect, useCallback } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { ArrowLeft, AlertTriangle, CheckCircle2, Loader2, Info, Usb } from 'lucide-react'

const MoveFromUsbView = ({ path, onBack, onComplete, addToast }) => {
  const { t } = useTranslation()
  const [status, setStatus] = useState('loading') // loading, confirm, exists_same, exists_different, processing, error, success
  const [details, setDetails] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  const checkPayload = useCallback(async () => {
    setStatus('loading')
    try {
      const res = await fetch(`/usb_move_check?path=${encodeURIComponent(path)}`)
      const data = await res.json()
      if (data.error) {
        setErrorMsg(data.error)
        setStatus('error')
      } else {
        setDetails(data)
        if (data.status === 'exists_same') setStatus('exists_same')
        else if (data.status === 'exists_different' || data.folder_exists) setStatus('exists_different')
        else setStatus('confirm')
      }
    } catch {
      setErrorMsg(t('moveFromUsb.failedToConnect'))
      setStatus('error')
    }
  }, [path, t])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      checkPayload()
    }, 0)
    return () => window.clearTimeout(timer)
  }, [checkPayload])

  const performMove = async (overwrite = false, keepOriginal = false) => {
    setStatus('processing')
    try {
      const res = await fetch(`/usb_move_perform?path=${encodeURIComponent(path)}&overwrite=${overwrite}&keep_original=${keepOriginal}`)
      const data = await res.json()
      if (data.error) {
        setErrorMsg(data.error)
        setStatus('error')
      } else {
        setStatus('success')
        addToast(data.warning || (keepOriginal ? t('moveFromUsb.copiedToast') : t('moveFromUsb.movedToast')))
        setTimeout(() => {
          onComplete()
        }, 2000)
      }
    } catch (e) {
      setErrorMsg(t('moveFromUsb.operationFailed'))
      setStatus('error')
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in pb-20">
      <button onClick={onBack} className="flex items-center space-x-3 text-zinc-500 hover:text-white transition-colors group">
        <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold uppercase tracking-widest text-sm">{t('moveFromUsb.backToManagement')}</span>
      </button>

      <div className="space-y-4">
        <h2 className="text-4xl font-extrabold text-white tracking-tight">
          {t('moveFromUsb.titleLead')} <span className="text-ps-blue">{t('moveFromUsb.titleAccent')}</span>
        </h2>
        <p className="text-zinc-500 max-w-2xl">{t('moveFromUsb.description')}</p>
      </div>

      <div className="glass-card p-6 md:p-10 rounded-ps-3xl border-white/10 bg-white/[0.02] space-y-8 md:space-y-10">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-8 text-center sm:text-left">
          <div className="p-4 md:p-6 bg-ps-blue/20 rounded-3xl border border-ps-blue/30 shrink-0">
            <Usb className="w-8 h-8 md:w-10 md:h-10 text-ps-blue" />
          </div>
          <div className="space-y-1 md:space-y-2 min-w-0 flex-1">
            <p className="label-caps !text-ps-blue">{t('moveFromUsb.sourcePath')}</p>
            <p className="text-xl md:text-2xl font-black text-white italic tracking-tight truncate w-full">{path}</p>
          </div>
        </div>

        <div className="h-px bg-white/5" />

        {status === 'loading' && (
          <div className="py-12 flex flex-col items-center justify-center space-y-6">
            <Loader2 className="w-12 h-12 text-ps-blue animate-spin" />
            <p className="label-caps animate-pulse text-zinc-500">{t('moveFromUsb.checkingInternalStorage')}</p>
          </div>
        )}

        {status === 'error' && (
          <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start space-x-6">
            <AlertTriangle className="w-8 h-8 text-red-500 shrink-0" />
            <div className="space-y-2">
              <p className="text-lg font-bold text-white">{t('moveFromUsb.somethingWentWrong')}</p>
              <p className="text-red-400/80 leading-relaxed">{errorMsg}</p>
              <button onClick={checkPayload} className="mt-4 px-6 py-2 bg-red-500 text-white rounded-xl font-bold text-sm">{t('moveFromUsb.retry')}</button>
            </div>
          </div>
        )}

        {status === 'exists_same' && (
          <div className="space-y-6 md:space-y-8">
            <div className="p-6 md:p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 text-center md:text-left">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 shrink-0" />
              <div className="space-y-2">
                <p className="text-lg font-bold text-white">{t('moveFromUsb.identicalFileExists')}</p>
                <p className="text-sm md:text-lg text-emerald-400/80 leading-relaxed">
                  {t('moveFromUsb.identicalFileDescription', { sha256: details?.sha256?.substring(0, 12) })}
                </p>
              </div>
            </div>
            <button onClick={onBack} className="w-full py-4 md:py-6 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-black uppercase italic text-lg md:text-xl transition-all border border-white/10">{t('moveFromUsb.returnToStorageHub')}</button>
          </div>
        )}

        {status === 'exists_different' && (
          <div className="space-y-6 md:space-y-8">
            <div className="p-6 md:p-8 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 text-center md:text-left">
              <AlertTriangle className="w-8 h-8 text-amber-500 shrink-0" />
              <div className="space-y-2">
                <p className="text-lg font-bold text-white">{t('moveFromUsb.previousVersionDetected')}</p>
                <p className="text-sm md:text-lg text-amber-400/80 leading-relaxed">
                  <Trans
                    i18nKey="moveFromUsb.previousVersionDescription"
                    values={{ name: details?.folder_name || details?.filename }}
                    components={{ strong: <strong /> }}
                  />
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={onBack} className="flex-1 py-4 md:py-6 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold uppercase transition-all">{t('common.cancel')}</button>
              <div className="flex flex-1 gap-2">
                <button onClick={() => performMove(true, true)} className="flex-1 py-4 md:py-6 rounded-2xl bg-ps-blue/50 hover:bg-ps-blue/70 text-white font-black uppercase italic text-sm md:text-lg transition-all border border-ps-blue/30">{t('moveFromUsb.overwriteAndCopy')}</button>
                <button onClick={() => performMove(true, false)} className="flex-1 py-4 md:py-6 rounded-2xl bg-ps-blue hover:bg-ps-blue/80 text-white font-black uppercase italic text-sm md:text-lg transition-all shadow-xl shadow-ps-blue/20">{t('moveFromUsb.overwriteAndMove')}</button>
              </div>
            </div>
          </div>
        )}

        {status === 'confirm' && (
          <div className="space-y-6 md:space-y-8">
            <div className="p-6 md:p-8 bg-ps-blue/5 border border-ps-blue/10 rounded-2xl flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 text-center md:text-left">
              <Info className="w-8 h-8 text-ps-blue shrink-0" />
              <div className="space-y-2">
                <p className="text-lg font-bold text-white">{t('moveFromUsb.readyToImport')}</p>
                <p className="text-sm md:text-lg text-zinc-400 leading-relaxed">
                  {t('moveFromUsb.readyToImportDescription')}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => performMove(false, true)} className="flex-1 py-4 md:py-6 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-black uppercase italic text-lg md:text-xl transition-all border border-white/20">{t('moveFromUsb.copyToInternal')}</button>
              <button onClick={() => performMove(false, false)} className="flex-1 py-4 md:py-6 rounded-2xl bg-ps-blue hover:bg-ps-blue/80 text-white font-black uppercase italic text-lg md:text-xl transition-all shadow-2xl shadow-ps-blue/30">{t('moveFromUsb.moveToInternalStorage')}</button>
            </div>
          </div>
        )}

        {status === 'processing' && (
          <div className="py-20 flex flex-col items-center justify-center space-y-8 text-center">
            <div className="ps5-robust-spinner" />
            <div className="space-y-2">
              <p className="text-2xl font-black text-white uppercase italic tracking-tighter animate-pulse">{t('moveFromUsb.importingPayload')}</p>
              <p className="text-zinc-500">{t('moveFromUsb.processingDescription')}</p>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="py-20 flex flex-col items-center justify-center space-y-8 text-center">
            <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/20 animate-in zoom-in duration-500">
              <CheckCircle2 className="w-14 h-14 text-white" />
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-black text-white uppercase italic tracking-tighter">{t('moveFromUsb.successTitle')}</p>
              <p className="text-zinc-500">{t('moveFromUsb.successDescription')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MoveFromUsbView
