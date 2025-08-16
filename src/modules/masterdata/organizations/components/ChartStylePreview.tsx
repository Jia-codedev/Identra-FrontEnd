import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChartStyle, chartStyleOptions } from './OrganizationChart';
import { useTranslations } from '@/hooks/use-translations';
import { useLanguage } from '@/providers/language-provider';
import {
    Network,
    ArrowRight,
    Grid3X3,
    Brain,
    Check
} from 'lucide-react';

interface ChartStylePreviewProps {
    currentStyle: ChartStyle;
    onStyleChange: (style: ChartStyle) => void;
}

export const ChartStylePreview: React.FC<ChartStylePreviewProps> = ({
    currentStyle,
    onStyleChange
}) => {
    const { t } = useTranslations();
    const { isRTL } = useLanguage();

    const getStyleIcon = (style: ChartStyle) => {
        switch (style) {
            case 'hierarchical':
                return <Network className="w-6 h-6" />;
            case 'radial':
                return <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-current"></div>
                </div>;
            case 'horizontal':
                return <ArrowRight className="w-6 h-6" />;
            case 'compact':
                return <Grid3X3 className="w-6 h-6" />;
            case 'mindmap':
                return <Brain className="w-6 h-6" />;
            default:
                return <Network className="w-6 h-6" />;
        }
    };

    const getStyleVisualization = (style: ChartStyle) => {
        const commonClasses = "w-2 h-2 rounded-sm bg-blue-500";
        const lineClasses = "absolute bg-blue-300";

        switch (style) {
            case 'hierarchical':
                return (
                    <div className="relative w-16 h-12 flex flex-col items-center">
                        {/* Root */}
                        <div className={`${commonClasses} mb-1`}></div>
                        {/* Vertical line */}
                        <div className={`${lineClasses} w-0.5 h-2`}></div>
                        {/* Horizontal line */}
                        <div className={`${lineClasses} w-8 h-0.5`}></div>
                        {/* Children */}
                        <div className="flex space-x-3 mt-1">
                            <div className={commonClasses}></div>
                            <div className={commonClasses}></div>
                            <div className={commonClasses}></div>
                        </div>
                        {/* Connecting lines */}
                        <div className={`${lineClasses} w-0.5 h-2 absolute left-4 top-6`}></div>
                        <div className={`${lineClasses} w-0.5 h-2 absolute left-8 top-6`}></div>
                        <div className={`${lineClasses} w-0.5 h-2 absolute right-4 top-6`}></div>
                    </div>
                );

            case 'radial':
                return (
                    <div className="relative w-16 h-12 flex items-center justify-center">
                        {/* Center */}
                        <div className={`${commonClasses} rounded-full`}></div>
                        {/* Surrounding nodes */}
                        <div className={`${commonClasses} rounded-full absolute top-0 left-1/2 -translate-x-1/2`}></div>
                        <div className={`${commonClasses} rounded-full absolute bottom-0 left-1/2 -translate-x-1/2`}></div>
                        <div className={`${commonClasses} rounded-full absolute left-0 top-1/2 -translate-y-1/2`}></div>
                        <div className={`${commonClasses} rounded-full absolute right-0 top-1/2 -translate-y-1/2`}></div>
                        {/* Lines */}
                        <div className={`${lineClasses} w-0.5 h-3 absolute top-2 left-1/2 -translate-x-1/2`}></div>
                        <div className={`${lineClasses} w-0.5 h-3 absolute bottom-2 left-1/2 -translate-x-1/2`}></div>
                        <div className={`${lineClasses} w-3 h-0.5 absolute left-2 top-1/2 -translate-y-1/2`}></div>
                        <div className={`${lineClasses} w-3 h-0.5 absolute right-2 top-1/2 -translate-y-1/2`}></div>
                    </div>
                );

            case 'horizontal':
                return (
                    <div className="relative w-16 h-12 flex items-center">
                        {/* Root */}
                        <div className={commonClasses}></div>
                        {/* Horizontal line */}
                        <div className={`${lineClasses} w-3 h-0.5 ml-1`}></div>
                        {/* Children column */}
                        <div className="flex flex-col space-y-1 ml-1">
                            <div className={commonClasses}></div>
                            <div className={commonClasses}></div>
                            <div className={commonClasses}></div>
                        </div>
                        {/* Connecting lines */}
                        <div className={`${lineClasses} w-0.5 h-1 absolute left-6 top-3`}></div>
                        <div className={`${lineClasses} w-0.5 h-1 absolute left-6 top-5`}></div>
                        <div className={`${lineClasses} w-0.5 h-1 absolute left-6 bottom-3`}></div>
                    </div>
                );

            case 'compact':
                return (
                    <div className="relative w-16 h-12">
                        <div className="grid grid-cols-3 gap-1 h-full">
                            <div className={`${commonClasses} rounded-sm`}></div>
                            <div className={`${commonClasses} rounded-sm`}></div>
                            <div className={`${commonClasses} rounded-sm`}></div>
                            <div className={`${commonClasses} rounded-sm`}></div>
                            <div className={`${commonClasses} rounded-sm`}></div>
                            <div className={`${commonClasses} rounded-sm`}></div>
                        </div>
                        {/* Grid lines */}
                        <div className={`${lineClasses} w-full h-0.5 absolute top-4`}></div>
                        <div className={`${lineClasses} w-0.5 h-full absolute left-5`}></div>
                        <div className={`${lineClasses} w-0.5 h-full absolute right-5`}></div>
                    </div>
                );

            case 'mindmap':
                return (
                    <div className="relative w-16 h-12 flex items-center justify-center">
                        {/* Center */}
                        <div className={`${commonClasses} rounded-full bg-purple-500`}></div>
                        {/* Branches */}
                        <div className={`w-2 h-2 rounded-full bg-green-500 absolute top-1 left-3`}></div>
                        <div className={`w-2 h-2 rounded-full bg-orange-500 absolute top-1 right-3`}></div>
                        <div className={`w-2 h-2 rounded-full bg-red-500 absolute bottom-1 left-2`}></div>
                        <div className={`w-2 h-2 rounded-full bg-blue-500 absolute bottom-1 right-2`}></div>
                        {/* Curved lines - simplified as straight for preview */}
                        <div className="absolute w-3 h-0.5 bg-purple-300 top-2 left-6 rotate-12"></div>
                        <div className="absolute w-3 h-0.5 bg-purple-300 top-2 right-6 -rotate-12"></div>
                        <div className="absolute w-3 h-0.5 bg-purple-300 bottom-2 left-4 -rotate-12"></div>
                        <div className="absolute w-3 h-0.5 bg-purple-300 bottom-2 right-4 rotate-12"></div>
                    </div>
                );
        }
    };

    return (
        <div className="mb-6">
            <h3 className={`text-lg font-semibold mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('masterData.organizations.structure.chartStyles') || 'Chart Styles'}
            </h3>
            <div className={`grid grid-cols-2 md:grid-cols-5 gap-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                {chartStyleOptions.map((option) => (
                    <Card
                        key={option.value}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                            currentStyle === option.value
                                ? 'ring-2 ring-primary border-primary bg-primary/5'
                                : 'hover:border-primary/50'
                        }`}
                        onClick={() => onStyleChange(option.value)}
                    >
                        <CardContent className="p-3">
                            <div className={`flex flex-col items-center space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                                {/* Style visualization */}
                                <div className="w-full h-12 flex items-center justify-center bg-muted/30 rounded-md relative overflow-hidden">
                                    {getStyleVisualization(option.value)}
                                </div>
                                
                                {/* Style info */}
                                <div className="w-full">
                                    <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                                        <div className={`flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                            {getStyleIcon(option.value)}
                                            <span className="font-medium text-sm">{option.label}</span>
                                        </div>
                                        {currentStyle === option.value && (
                                            <Check className="w-4 h-4 text-primary" />
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                        {option.description}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ChartStylePreview;
