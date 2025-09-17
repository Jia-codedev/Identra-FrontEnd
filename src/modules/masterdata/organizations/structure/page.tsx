'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Building2,
    RefreshCw,
    Download,
    AlertCircle,
    Languages,
} from 'lucide-react';
import { useTranslations } from '@/hooks/use-translations';
import { useLanguage } from '@/providers/language-provider';
import { useOrganizationStructure } from '../hooks/useOrganizationStructure';
import { OrganizationChart } from '../components/OrganizationChart';
import { IOrganizationStructure } from '../types';

const OrganizationStructurePage: React.FC = () => {
    const { t } = useTranslations();
    const { currentLocale, isRTL, setLanguage } = useLanguage();
    const fixedChartStyle = 'horizontal';
    const {
        data: organizationData,
        isLoading,
        error,
        refetch,
        isRefetching
    } = useOrganizationStructure();

    const handleRefresh = () => {
        refetch();
    };

    const handleExport = () => {
        if (!organizationData?.data) return;

        const dataStr = JSON.stringify(organizationData.data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = `organization-structure-${new Date().toISOString().split('T')[0]}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const handleLanguageToggle = () => {
        const newLanguage = currentLocale === 'en' ? 'ar' : 'en';
        setLanguage(newLanguage);
    };

    // Calculate statistics
    const getStatistics = () => {
        if (!organizationData?.data) return { totalOrgs: 0, maxDepth: 0, totalTypes: 0 };

        let totalOrgs = 0;
        let maxDepth = 0;
        const organizationTypes = new Set<string>();

        const traverse = (orgs: IOrganizationStructure[], depth = 0) => {
            maxDepth = Math.max(maxDepth, depth);

            orgs.forEach(org => {
                totalOrgs++;
                if (org.organization_types?.organization_type_eng) {
                    organizationTypes.add(org.organization_types.organization_type_eng);
                }

                if (org.children && org.children.length > 0) {
                    traverse(org.children, depth + 1);
                }
            });
        };

        traverse(organizationData.data);

        return {
            totalOrgs,
            maxDepth: maxDepth + 1,
            totalTypes: organizationTypes.size
        };
    };

    // const statistics = getStatistics(); // Commented out as it's not used

    return (
        <div className={`p-2 space-y-6-lg ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Header */}
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="space-y-1 p-2 px-4">
                    <h1 className={`text-3xl font-bold tracking-tight flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Building2 className="h-8 w-8" />
                        {t('masterData.organizations.structure.title')}
                    </h1>
                    <p className="text-muted-foreground">
                        {t('masterData.organizations.structure.description')}
                    </p>
                </div>

                <div className={`flex items-center gap-2 px-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {/* Horizontal layout is fixed — no selector shown */}

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleLanguageToggle}
                        className={`gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                        title={currentLocale === 'en' ? t('common.switchToArabic') : t('common.switchToEnglish')}
                    >
                        <Languages className="h-4 w-4" />
                        {currentLocale === 'en' ? 'عربي' : 'English'}
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        disabled={isLoading || isRefetching}
                        className={`gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                        <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
                        {t('common.refresh')}
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExport}
                        disabled={!organizationData?.data || isLoading}
                        className={`gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                        <Download className="h-4 w-4" />
                        {t('common.export')}
                    </Button>
                </div>
            </div>
            
            {/* Style Preview */}
            {/* No style preview — chart is always horizontal */}

            <div className="border rounded p-1">
                {/* Main Content */}
                {isLoading ? (
                    <div className="">
                        <div className="flex justify-center">
                            <Skeleton className="h-8 w-64" />
                        </div>
                    </div>
                ) : error ? (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            {t('common.error')}: {error.message}
                        </AlertDescription>
                    </Alert>
                ) : organizationData?.data && organizationData.data.length > 0 ? (
                    <OrganizationChart data={organizationData.data} style={fixedChartStyle} />
                ) : (
                    <div className={`flex flex-col items-center justify-center text-muted-foreground space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                        <Building2 className="h-12 w-12 opacity-50" />
                        <h3 className="text-lg font-medium">{t('common.noDataFound')}</h3>
                        <p className="text-sm">{t('masterdata.organizations.structure.noOrganizationsFound')}</p>
                        <Button variant="outline" onClick={handleRefresh} className={`mt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <RefreshCw className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                            {t('common.retry')}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrganizationStructurePage;
