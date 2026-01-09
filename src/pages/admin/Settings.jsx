import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Shield, Globe, Database, Smartphone, XCircle, CheckCircle, Save, Smartphone as PhoneIcon, Lock, Mail, Phone, Cloud, Key, History } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import toast from 'react-hot-toast';

const AdminSettings = () => {
    const [activeSection, setActiveSection] = useState('Général');
    const [saving, setSaving] = useState(false);

    const sections = [
        { id: 'Général', title: 'Général', icon: Globe, description: 'Configuration globale du système' },
        { id: 'Notifications', title: 'Notifications', icon: Bell, description: 'Alertes SMS et Push' },
        { id: 'Sécurité', title: 'Sécurité', icon: Shield, description: 'Rôles et permissions' },
        { id: 'Mobile', title: 'Application mobile', icon: Smartphone, description: 'Paramètres livreurs' },
        { id: 'Sauvegarde', title: 'Sauvegarde', icon: Database, description: 'Gestion des données' },
    ];

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            toast.success(`Paramètres "${activeSection}" enregistrés avec succès!`);
        }, 1000);
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'Général':
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <section>
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Globe size={20} className="text-blue-600" />
                                Informations de l'entreprise
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Nom de la plateforme" defaultValue="Delivery Pro" icon={Globe} />
                                <Input label="Email de contact" defaultValue="contact@deliverypro.bj" icon={Mail} />
                                <Input label="Téléphone support" defaultValue="+22901234567" icon={Phone} />
                                <Input label="Site web" defaultValue="https://deliverypro.bj" />
                            </div>
                        </section>

                        <div className="h-[1px] bg-gray-100"></div>

                        <section>
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Database size={20} className="text-blue-600" />
                                Configuration des tarifs
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Prix de base (CFA)" type="number" defaultValue="500" />
                                <Input label="Prix au KM (CFA)" type="number" defaultValue="200" />
                            </div>
                        </section>
                    </div>
                );
            case 'Notifications':
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <section>
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Bell size={20} className="text-blue-600" />
                                Canaux de notifications
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                                            <PhoneIcon size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">Notifications Push</p>
                                            <p className="text-xs text-gray-500">Envoyer des alertes sur mobile</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                                            <Bell size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">Alertes SMS</p>
                                            <p className="text-xs text-gray-500">Service Twilio/Kudi</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>
                        </section>
                        <section className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                            <div className="flex gap-3">
                                <AlertCircle className="text-amber-600 flex-shrink-0" size={20} />
                                <div>
                                    <p className="text-sm font-bold text-amber-900">Clé API SMS manquante</p>
                                    <p className="text-xs text-amber-700 mt-1">Veuillez configurer votre clé API SMS pour activer les notifications par messages.</p>
                                </div>
                            </div>
                        </section>
                    </div>
                );
            case 'Sécurité':
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <section>
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Shield size={20} className="text-blue-600" />
                                Paramètres d'accès
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input label="Délai d'expiration session (min)" type="number" defaultValue="60" icon={History} />
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-gray-700">Complexité mot de passe</label>
                                    <select className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-sm">
                                        <option>Standard (min 8 caractères)</option>
                                        <option>Forte (Maj, Chiffre, Caractère spécial)</option>
                                        <option>Critique (Rotation 30 jours)</option>
                                    </select>
                                </div>
                            </div>
                        </section>
                        <section>
                            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <div className="flex items-center gap-3">
                                    <Lock size={20} className="text-blue-600" />
                                    <div>
                                        <p className="font-bold text-blue-900">Double Authentification (2FA)</p>
                                        <p className="text-xs text-blue-700">Recommandé pour tous les administrateurs</p>
                                    </div>
                                </div>
                                <button className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-all">Activer</button>
                            </div>
                        </section>
                    </div>
                );
            case 'Mobile':
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <section>
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Smartphone size={20} className="text-blue-600" />
                                Paramètres App Livreur
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Rayon de tracking (mètres)" type="number" defaultValue="50" />
                                <Input label="Version minimale app" defaultValue="1.2.5" />
                            </div>
                        </section>
                        <section>
                            <div className="p-4 bg-gray-50 rounded-xl space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">Auto-assignation</p>
                                        <p className="text-xs text-gray-500">Attribuer auto aux livreurs les plus proches</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>
                        </section>
                    </div>
                );
            case 'Sauvegarde':
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <section>
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Database size={20} className="text-blue-600" />
                                Maintenance des données
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 border-2 border-dashed border-gray-200 rounded-2xl text-center hover:border-blue-400 transition-all cursor-pointer group">
                                    <Cloud size={32} className="mx-auto text-gray-400 group-hover:text-blue-500 mb-2" />
                                    <p className="font-bold text-gray-900">Export Complet</p>
                                    <p className="text-xs text-gray-500 mt-1">Format JSON / CSV</p>
                                </div>
                                <div className="p-6 border-2 border-dashed border-gray-200 rounded-2xl text-center hover:border-blue-400 transition-all cursor-pointer group">
                                    <History size={32} className="mx-auto text-gray-400 group-hover:text-blue-500 mb-2" />
                                    <p className="font-bold text-gray-900">Restaurer</p>
                                    <p className="text-xs text-gray-500 mt-1">Dernier backup: 09/01/26</p>
                                </div>
                            </div>
                        </section>
                        <section className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200 relative overflow-hidden">
                            <div className="relative z-10">
                                <h4 className="text-lg font-bold mb-2">Backups Automatiques en ligne</h4>
                                <p className="text-sm text-blue-100 opacity-80 mb-6">Vos données sont sauvegardées chaque soir à 02:00 sur nos serveurs sécurisés Google Cloud.</p>
                                <Button className="bg-white text-blue-600 hover:bg-blue-50 border-none px-6">Forcer le backup maintenant</Button>
                            </div>
                            <Database size={120} className="absolute -bottom-10 -right-10 text-white/10 rotate-12" />
                        </section>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Paramètres</h1>
                <p className="text-gray-500">Configurez le fonctionnement de la plateforme en temps réel</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Card */}
                <Card className="lg:col-span-2 overflow-hidden bg-white/50 backdrop-blur border-white">
                    <div className="min-h-[400px]">
                        {renderContent()}

                        <div className="mt-12 flex justify-end gap-3 pt-6 border-t border-gray-100">
                            <Button variant="outline" size="lg" disabled={saving}>Annuler</Button>
                            <Button size="lg" onClick={handleSave} loading={saving}>
                                <Save size={18} className="mr-2" />
                                Enregistrer les modifications
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Sidebar Navigation */}
                <div className="space-y-4">
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest px-2">Sections</p>
                    <div className="space-y-3">
                        {sections.map((sec) => {
                            const isSelected = activeSection === sec.id;
                            const Icon = sec.icon;
                            return (
                                <div
                                    key={sec.id}
                                    onClick={() => setActiveSection(sec.id)}
                                    className={`p-4 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden ${isSelected
                                            ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200 -translate-y-1'
                                            : 'bg-white border-gray-100 hover:border-blue-300 hover:shadow-md'
                                        }`}
                                >
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className={`p-2.5 rounded-xl ${isSelected
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-50 group-hover:bg-blue-50 group-hover:text-blue-600 text-gray-500'
                                            } transition-all`}>
                                            <Icon size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-lg leading-tight">{sec.title}</p>
                                            <p className={`text-xs mt-1 ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}>
                                                {sec.description}
                                            </p>
                                        </div>
                                    </div>
                                    {isSelected && (
                                        <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-white/10 to-transparent"></div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Quick Help Card */}
                    <div className="p-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl text-white shadow-xl mt-6 relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-sm font-bold opacity-80 uppercase tracking-wider mb-2">Besoin d'aide ?</p>
                            <p className="text-lg font-black leading-tight mb-4">Notre support est disponible 24/7</p>
                            <button className="bg-white/20 hover:bg-white/30 backdrop-blur px-4 py-2 rounded-xl text-xs font-bold transition-all border border-white/20">Consulter la documentation</button>
                        </div>
                        <SettingsIcon size={120} className="absolute -bottom-10 -right-10 text-white/10 rotate-12" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
