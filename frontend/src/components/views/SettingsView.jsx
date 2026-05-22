import React from 'react'
import { useTranslation } from 'react-i18next'
import { Languages, Zap, Terminal, ChevronRight } from 'lucide-react'
import { cn } from '../../utils/helpers'
import { setAppLanguage, supportedLocales } from '../../i18n'

const SettingsView = ({ config, onSaveConfig, isPS5, logs, setLogs, showLogs, setShowLogs }) => {
  const { t, i18n } = useTranslation()
  const autoOpen = config.AUTO_BROWSER_OPEN !== false
  const autoInstall = config.AUTO_INSTALL_APP !== false
  const autoloadDelay = config.AUTOLOAD_DELAY || 5

  const SettingRow = ({ title, description, children, icon: Icon }) => (
    <div className="flex items-center justify-between p-8 bg-white/[0.03] rounded-3xl border border-white/10 hover:border-ps-blue/30 transition-all group h-full">
      <div className="flex items-center space-x-6">
        {Icon && (
          <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-ps-blue/10 transition-colors">
            <Icon className="w-6 h-6 text-zinc-500 group-hover:text-ps-blue transition-colors" />
          </div>
        )}
        <div className="space-y-1">
          <p className="font-bold text-white uppercase text-lg tracking-tight">{title}</p>
          <p className="text-sm text-zinc-500 max-w-md">{description}</p>
        </div>
      </div>
      <div className="shrink-0 ml-8">
        {children}
      </div>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto space-y-16 pb-20">
      <div className="space-y-4">
        <h2 className="text-4xl font-extrabold text-white tracking-tight">
          {t('settings.title')}
        </h2>
      </div>

      {/* Startup Settings */}
      <section className="space-y-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <SettingRow
            title={t('settings.autoOpenTitle')}
            description={t('settings.autoOpenDescription')}
            icon={Zap}
          >
            <button
              onClick={() => onSaveConfig({ AUTO_BROWSER_OPEN: !autoOpen })}
              className={cn(
                "w-20 h-10 rounded-full transition-all relative p-1.5",
                autoOpen ? "bg-ps-blue" : "bg-white/10"
              )}
            >
              <div className={cn(
                "w-7 h-7 bg-white rounded-full transition-all",
                autoOpen ? "translate-x-10" : "translate-x-0"
              )} />
            </button>
          </SettingRow>

          <SettingRow
            title={t('settings.autoInstallTitle')}
            description={t('settings.autoInstallDescription')}
            icon={Zap}
          >
            <button
              onClick={() => onSaveConfig({ AUTO_INSTALL_APP: !autoInstall })}
              className={cn(
                "w-20 h-10 rounded-full transition-all relative p-1.5",
                autoInstall ? "bg-ps-blue" : "bg-white/10"
              )}
            >
              <div className={cn(
                "w-7 h-7 bg-white rounded-full transition-all",
                autoInstall ? "translate-x-10" : "translate-x-0"
              )} />
            </button>
          </SettingRow>

          <SettingRow
            title={t('settings.killDiscPlayerTitle')}
            description={t('settings.killDiscPlayerDescription')}
            icon={Zap}
          >
            <button
              onClick={() => onSaveConfig({ KILL_DISC_PLAYER_ON_STARTUP: !config.KILL_DISC_PLAYER_ON_STARTUP })}
              className={cn(
                "w-20 h-10 rounded-full transition-all relative p-1.5",
                config.KILL_DISC_PLAYER_ON_STARTUP !== false ? "bg-ps-blue" : "bg-white/10"
              )}
            >
              <div className={cn(
                "w-7 h-7 bg-white rounded-full transition-all",
                config.KILL_DISC_PLAYER_ON_STARTUP !== false ? "translate-x-10" : "translate-x-0"
              )} />
            </button>
          </SettingRow>

          <SettingRow
            title={t('settings.scanUsbTitle')}
            description={t('settings.scanUsbDescription')}
            icon={Zap}
          >
            <button
              onClick={() => onSaveConfig({ SCAN_USB_PAYLOADS: !config.SCAN_USB_PAYLOADS })}
              className={cn(
                "w-20 h-10 rounded-full transition-all relative p-1.5",
                config.SCAN_USB_PAYLOADS ? "bg-ps-blue" : "bg-white/10"
              )}
            >
              <div className={cn(
                "w-7 h-7 bg-white rounded-full transition-all",
                config.SCAN_USB_PAYLOADS ? "translate-x-10" : "translate-x-0"
              )} />
            </button>
          </SettingRow>

          <div className="flex flex-col justify-between p-8 bg-white/[0.03] rounded-3xl border border-white/10 space-y-8 h-full">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="font-bold text-white uppercase text-lg tracking-tight">{t('settings.autoloadDelayTitle')}</p>
                <p className="text-sm text-zinc-500">{t('settings.autoloadDelayDescription')}</p>
              </div>
              <span className="text-ps-blue font-black text-4xl italic tracking-tighter">{autoloadDelay}s</span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[3, 5, 10].map(s => (
                <button
                  key={s}
                  onClick={() => onSaveConfig({ AUTOLOAD_DELAY: s })}
                  className={cn(
                    "py-5 rounded-2xl font-black text-xl transition-all border uppercase italic",
                    autoloadDelay === s
                      ? "bg-ps-blue border-ps-blue text-white scale-[1.02]"
                      : "bg-white/5 border-white/10 text-zinc-500 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {s}s
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Language Section */}
      <section className="space-y-8">
        <h3 className="label-caps !text-ps-blue !opacity-100 flex items-center space-x-4 text-xl tracking-[0.2em]">
          <Languages className="w-6 h-6" />
          <span>{t('settings.languageTitle')}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {supportedLocales.map((locale) => {
            const active = i18n.resolvedLanguage === locale.code
            return (
              <button
                key={locale.code}
                onClick={() => setAppLanguage(locale.code)}
                className={cn(
                  'flex items-center justify-between p-6 rounded-3xl border transition-all text-left',
                  active
                    ? 'bg-ps-blue/10 border-ps-blue text-white'
                    : 'bg-white/[0.03] border-white/10 text-zinc-300 hover:border-ps-blue/30',
                )}
              >
                <p className="font-bold uppercase text-lg tracking-tight">{locale.label}</p>
                <div
                  className={cn(
                    'w-3 h-3 rounded-full shrink-0',
                    active ? 'bg-ps-blue' : 'bg-zinc-600',
                  )}
                />
              </button>
            )
          })}
        </div>
      </section>

      {/* Diagnostics */}
      <section className="space-y-8">
        <h3 className="label-caps !text-ps-blue !opacity-100 flex items-center space-x-4 text-xl tracking-[0.2em]">
          <Terminal className="w-6 h-6" />
          <span>{t('settings.diagnosticsSection')}</span>
        </h3>

        <button
          onClick={() => setShowLogs(true)}
          className="w-full group flex items-center justify-between p-8 bg-white/[0.03] rounded-3xl border border-white/10 hover:border-ps-blue/50 hover:bg-ps-blue/5 transition-all text-left"
        >
          <div className="flex items-center space-x-6">
            <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-ps-blue/10 transition-colors">
              <Terminal className="w-6 h-6 text-zinc-500 group-hover:text-ps-blue transition-colors" />
            </div>
            <div className="space-y-1">
              <p className="font-bold text-white uppercase text-lg tracking-tight">{t('settings.openLogsTitle')}</p>
              <p className="text-sm text-zinc-500 max-w-md">{t('settings.openLogsDescription')}</p>
            </div>
          </div>
          <ChevronRight className="w-8 h-8 text-zinc-700 group-hover:text-ps-blue group-hover:translate-x-2 transition-all" />
        </button>
      </section>

    </div>
  )
}

export default SettingsView
