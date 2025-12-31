import React from 'react';
import { Settings as SettingsIcon, Bell, Shield, Globe, Database, Smartphone } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const AdminSettings = () => {
    const sections = [
        { title: 'Général', icon: Globe, description: 'Configuration globale du système' },
        { title: 'Notifications', icon: Bell, description: 'Alertes SMS et Push' },
        { title: 'Sécurité', icon: Shield, description: 'Rôles et permissions' },
        { title: 'Application mobile', icon: Smartphone, description: 'Paramètres livreurs' },
        { title: 'Sauvegarde', icon: Database, description: 'Gestion des données' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Paramètres</h1>
                <p className="text-gray-500">Configurez le fonctionnement de la plateforme</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2">
                    <div className="space-y-8">
                        <section>
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Globe size={20} className="text-blue-600" />
                                Informations de l'entreprise
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Nom de la plateforme" defaultValue="Delivery Pro" />
                                <Input label="Email de contact" defaultValue="contact@deliverypro.bj" />
                                <Input label="Téléphone support" defaultValue="+22901234567" />
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

                        <div className="flex justify-end gap-3 pt-4">
                            <Button variant="outline">Annuler</Button>
                            <Button>Enregistrer les modifications</Button>
                        </div>
                    </div>
                </Card>

                <div className="space-y-4">
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest px-2">Sections</p>
                    {sections.map((sec, idx) => (
                        <div
                            key={idx}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer group ${idx === 0 ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white border-gray-100 hover:border-blue-200'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-xl ${idx === 0 ? 'bg-blue-500' : 'bg-gray-50 group-hover:bg-blue-50 group-hover:text-blue-600'} transition-all`}>
                                    <sec.icon size={20} />
                                </div>
                                <div>
                                    <p className="font-bold">{sec.title}</p>
                                    <p className={`text-xs ${idx === 0 ? 'text-blue-100' : 'text-gray-400'}`}>{sec.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
