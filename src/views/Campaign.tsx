import React, { 
    useEffect, 
    useState, 
    useRef 
} from 'react'
import { 
    Box, 
    Typography, 
    TextField, 
    Button, 
    Dialog, 
    DialogContent, 
    IconButton, 
    Divider, 
    Switch, 
    Paper, 
    Checkbox
} from '@mui/material'
import { 
    CheckCircle, 
    //RadioButtonUnchecked, 
    CloudUpload, 
    WarningAmber, 
    Instagram, 
    Facebook, 
    X, 
    CalendarMonth,
    AccessTime,
    DoneAll
} from '@mui/icons-material'
// MUI Date Pickers
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs, { Dayjs } from 'dayjs';

import { motion, AnimatePresence } from 'framer-motion'
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { BarLoader } from 'react-spinners'
import type { RootState } from '../store/store'
import { 
    useGenerateCampaignMutation, 
    type GenerateCampaignDTO, 
    type Campaign as CampaignType,
} from '../api/campaignApi'

interface GeneratedContent {
    type: string
    description: string
    keywords: string[]
}

interface ParsedCampaign {
    captions: string [] | null
    image_prompts: GeneratedContent [] | null
    video_prompts: GeneratedContent [] | null
}

interface EditableContent {
    [key: string]: string[] | object
}

const Campaign: React.FC<CampaignType> = () => {
    const theme = useSelector((state: RootState) => state.theme)
    const [generateCampaign, { isLoading: isGeneratingCampaign }] = useGenerateCampaignMutation()
    
    const campaignRef = useRef<HTMLDivElement>(null);
    const scheduleRef = useRef<HTMLDivElement>(null);

    const [campaignResult, setCampaignResult] = useState<ParsedCampaign | null>(null)
    const [images, setImages] = useState<{ [key: string]: string[] }>({})
    const [loadingImg, setLoadingImg] = useState<{ [key: string]: boolean }>({})
    const [selectedImg, setSelectedImg] = useState<string | null>(null)

    // NEW: Granular Approval States (Individual Assets)
    const [approvedAssets, setApprovedAssets] = useState<{ [key: string]: string[] }>({})
    const [approvedCaptions, setApprovedCaptions] = useState<number[]>([])
    
    // Global Access State
    const [isApproved, setIsApproved] = useState(false)

    // Schedule States
    const [launchDate, setLaunchDate] = useState<Dayjs | null>(dayjs())
    const [launchTime, setLaunchTime] = useState<Dayjs | null>(dayjs())
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['Instagram'])
    const [notificationsEnabled, setNotificationsEnabled] = useState(true)

    const [editableContent, setEditableContent] = useState<EditableContent>({ images: {}, videos: {}, captions: {} });
    const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({});

    const { handleSubmit, register, setValue, reset } = useForm<GenerateCampaignDTO>()

    useEffect(() => {
        if (isApproved && scheduleRef.current) {
            scheduleRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [isApproved]);

    useEffect(()=>console.log(campaignResult),[campaignResult])
    useEffect(()=>console.log(editableContent),[editableContent])

    // Asset Selection Logic
    const toggleAssetApproval = (promptKey: string, url: string) => {
        setApprovedAssets(prev => {
            const current = prev[promptKey] || [];
            if (current.includes(url)) {
                return { ...prev, [promptKey]: current.filter(u => u !== url) };
            }
            return { ...prev, [promptKey]: [...current, url] };
        });
    };

    const approveAllForPrompt = (promptKey: string) => {
        const allUrls = images[promptKey] || [];
        setApprovedAssets(prev => ({ ...prev, [promptKey]: allUrls }));
    };

    // const toggleCaptionApproval = (index: number) => {
    //     setApprovedCaptions(prev => 
    //         prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    //     );
    // };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        const files = e.target.files;
        if (files) {
            const newUrls = Array.from(files).map(file => URL.createObjectURL(file));
            setImages(prev => ({ ...prev, [key]: [...(prev[key] || []), ...newUrls] }));
        }
    };

    // Original Flow Logic
    const onSubmit = async (data: GenerateCampaignDTO) => {
        setValue("userId", "1")
        const response = await generateCampaign(data)
        if (response?.data) {
            const parsed = JSON.parse(response.data.content);
            setCampaignResult(parsed);
            setEditableContent({
                images: parsed.image_prompts.map((img: GeneratedContent) => img.description),
                videos: parsed.video_prompts.map((vid: GeneratedContent) => vid.description),
                captions: parsed.captions.map((cap: string) => cap)
            });
        }
    }

    const handleBack = () => {
        campaignRef.current?.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => setIsApproved(false), 800);
    };

    const handleEditChange = (section: string, index: number, value: string) => {
        setEditableContent((prev: EditableContent) => ({ ...prev, [section]: { ...prev[section], [index]: value } }));
    };

    const toggleEdit = (key: string) => {
        setIsEditing(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handlePuterImage = async (index: number, section: string) => {
        const sectionKey = section === 'images' ? 'images' : 'videos';
        const content = editableContent[sectionKey] as string[];
        const prompt = content[index];
        const key = `${section === 'images' ? 'img' : 'vid'}-${index}`;
        setLoadingImg(prev => ({ ...prev, [key]: true }))
        try {
            // @ts-ignore
            const promises = [0, 1, 2].map(() => puter.ai.txt2img(prompt));
            const results = await Promise.all(promises);
            setImages(prev => ({ ...prev, [key]: results.map(res => res.src) }))
        } catch (err) { console.error(err) } finally { setLoadingImg(prev => ({ ...prev, [key]: false })) }
    }

    const handleReset = () => {
        setCampaignResult(null); setImages({}); setIsApproved(false);
        setApprovedAssets({}); setApprovedCaptions([]);
        setEditableContent({ images: {}, videos: {}, captions: {} });
        reset();
    }

    const platforms = [
                                { name: 'Instagram', handle: '@founder_studio', icon: <Instagram sx={{ color: '#E1306C' }} /> },
                                { name: 'Facebook', handle: 'Not connected', icon: <Facebook sx={{ color: '#1877F2' }} /> },
                                { name: 'X (Twitter)', handle: '@founder_hq', icon: <X sx={{ color: '#000' }} /> }
                            ]

    return (
        <LocalizationProvider 
            dateAdapter={AdapterDayjs}
            >
        <Box 
            sx={{ 
                mt: '8vh', 
                width: '100%', 
                height: '100%', 
                background: 'transparent', 
                backdropFilter: `blur(3px)`, 
                }}>
            
            {/* SECTION 1: CAMPAIGN GENERATION */}
            <Box 
                ref={campaignRef} 
                sx={{ 
                    minHeight: '85vh', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    background: 'transparent', 
                    p: 4 
                    }}>
                <Box 
                    sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        width: '100%', 
                        gap: 2 
                        }}>
                    
                    {/* FORM BOX - Styles Preserved */}
                    <motion.div 
                        layout 
                        animate={{ 
                            width: campaignResult ? '35%' : '80%' 
                        }} 
                        style={{ 
                            background: theme.colors.background, 
                            padding: '30px', 
                            borderRadius: '20px', 
                            boxShadow: theme.borderRadius
                             }}
                             >
                        <form 
                            onSubmit={handleSubmit(onSubmit)}
                            >
                            <Typography 
                                variant='h2' 
                                fontWeight='bolder' 
                                color={theme.colors.text}
                                >New Campaign</Typography>
                            <Box 
                                sx={{ 
                                    mt: 3 
                                    }}>
                                <Typography 
                                    fontWeight='bold'
                                    >Product Name</Typography>
                                <TextField 
                                    fullWidth 
                                    {...register(`product_name`, { required: true })} 
                                    sx={{ 
                                        background: theme.colors.backgroundSecondary, 
                                        color: theme.colors.text 
                                        }} 
                                    disabled={isGeneratingCampaign} 
                                    />
                            </Box>
                            <Box 
                                sx={{ 
                                    mt: 2, 
                                    mb: 4 
                                    }}
                                    >
                                <Typography 
                                    fontWeight='bold'
                                    >Target Audience</Typography>
                                <TextField 
                                    fullWidth 
                                    {...register(`target_audience`, { required: true })} 
                                    sx={{ 
                                        background: theme.colors.backgroundSecondary, 
                                        color: theme.colors.text 
                                        }} 
                                    disabled={isGeneratingCampaign} />
                            </Box>

                            {!campaignResult && (
                                <Box 
                                    sx={{ 
                                        mb: 2 
                                        }}>
                                    <Divider 
                                        sx={{ 
                                            mb: 2 
                                            }} />
                                    <Typography 
                                        fontWeight='bold'
                                        >Attention! Read carefully:</Typography>
                                    <Typography 
                                        variant='caption' 
                                        sx={{ 
                                            whiteSpace: 'pre-line' 
                                            }}>
                                        ⚠️ Responsible Use of AI-Generated Content... (Standard Disclaimer)
                                    </Typography>
                                </Box>
                            )}

                            <Box 
                                sx={{ 
                                    width: '100%', 
                                    display: 'flex', 
                                    justifyContent: 'center' 
                                    }}>
                                <Button 
                                    variant='contained' 
                                    type='submit' 
                                    disabled={isGeneratingCampaign} 
                                    sx={{ 
                                        background: theme.colors.secondary, 
                                        width: '120px' 
                                        }}>
                                    {!isGeneratingCampaign ? 'Generate' : <BarLoader color="#fff" />}
                                </Button>
                            </Box>
                        </form>
                    </motion.div>

                    {/* RESPONSE BOX - Styles Preserved */}
                    <AnimatePresence>
                        {campaignResult && (
                            <motion.div 
                                initial={{ 
                                    opacity: 0, 
                                    x: 50 
                                    }} 
                                animate={{ 
                                    opacity: 1, 
                                    x: 0 
                                    }} 
                                style={{ 
                                    width: '65%', 
                                    background: theme.colors.background, 
                                    borderRadius: theme.borderRadius, 
                                    padding: '30px', 
                                    overflowY: 'scroll', 
                                    boxShadow: theme.boxShadow, 
                                    maxHeight: '65dvh', 
                                    scrollbarWidth: 'none' 
                                    }}>
                                <Typography 
                                    variant="h2" 
                                    fontWeight="bold" 
                                    color={theme.colors.text}
                                    >Prompts</Typography>
                                
                                {['images', 'videos'].map((sectionKey) => (
                                    <React.Fragment 
                                        key={sectionKey}
                                        >
                                        <Typography 
                                            variant="h5" 
                                            fontWeight="bold" 
                                            color={theme.colors.text} 
                                            sx={{ 
                                                mt: 4, 
                                                textTransform: 'capitalize' 
                                                }}>{sectionKey}</Typography>
                                        {(campaignResult[sectionKey === 'images' ? 'image_prompts' : 'video_prompts'] || []).map((_: GeneratedContent, i: number) => {
                                            const key = `${sectionKey === 'images' ? 'img' : 'vid'}-${i}`;
                                            return (
                                                <Box 
                                                    key={i} 
                                                    sx={{ 
                                                        mb: 2, 
                                                        p: 2, 
                                                        border: '1px solid #eee', 
                                                        borderRadius: '12px' 
                                                        }}>
                                                    <Box 
                                                        sx={{ 
                                                            display: 'flex', 
                                                            justifyContent: 'space-between', 
                                                            gap: 2 
                                                            }}>
                                                                {isEditing[key] ? 
                                                                    <TextField 
                                                                        fullWidth 
                                                                        multiline 
                                                                        size="small" 
                                                                        value={(editableContent[sectionKey] as string[])[i]} 
                                                                        onChange={
                                                                            (e) => handleEditChange(sectionKey, i, e.target.value)
                                                                        } /> : 
                                                                    <Typography 
                                                                        variant="body2" 
                                                                        color={theme.colors.text} 
                                                                        sx={{ 
                                                                            flex: 1 
                                                                        }}>{(editableContent[sectionKey] as string[])[i]}</Typography>
                                                                }
                                                        <Box sx={{ 
                                                            display: 'flex', 
                                                            gap: 1 
                                                            }}>
                                                            <Button 
                                                                variant="contained" 
                                                                size="small" 
                                                                startIcon={<DoneAll />}
                                                                disabled={images.image_prompts?.length === 0} 
                                                                onClick={
                                                                    () => approveAllForPrompt(key)
                                                                }
                                                                sx={{
                                                                    background: theme.colors.textSecondary
                                                                }}
                                                                    >Approve All</Button>
                                                            <Button 
                                                                variant="contained" 
                                                                size="small" 
                                                                onClick={
                                                                    () => toggleEdit(key)
                                                                    }
                                                                sx={{
                                                                    background: theme.colors.textSecondary
                                                                }}
                                                                    >Edit</Button>
                                                            <Button
                                                                variant="contained" 
                                                                size="small" 
                                                                onClick={
                                                                    () => handlePuterImage(i, sectionKey)
                                                                    } 
                                                                disabled={loadingImg[key]}
                                                                sx={{
                                                                    background: theme.colors.textSecondary
                                                                }}
                                                                >Generate</Button>
                                                            <input type="file" id={`upload-${key}`} hidden onChange={(e) => handleFileUpload(e, key)} multiple accept="image/*" />
                                                            <label htmlFor={`upload-${key}`}>
                                                                <Button 
                                                                    variant="contained" 
                                                                    size="small" 
                                                                    component="span"
                                                                    sx={{
                                                                    background: theme.colors.secondary
                                                                            }}
                                                                    >
                                                                        <CloudUpload /></Button>
                                                            </label>
                                                        </Box>
                                                    </Box>
                                                    <Box 
                                                        sx={{ 
                                                            display: 'flex', 
                                                            gap: 1, 
                                                            mt: 2, 
                                                            flexWrap: 'wrap' 
                                                            }}>
                                                        {images[key]?.map((url, idx) => {
                                                            const isSelected = approvedAssets[key]?.includes(url);
                                                            return (
                                                                <Box 
                                                                    key={idx} 
                                                                    sx={{ 
                                                                        position: 'relative', 
                                                                        width: '80px', 
                                                                        height: '80px' 
                                                                        }}>
                                                                    <img 
                                                                        src={url} 
                                                                        alt="thumb" 
                                                                        onClick={
                                                                            () => setSelectedImg(url)
                                                                            } 
                                                                        style={{ 
                                                                            width: '100%', 
                                                                            height: '100%', 
                                                                            borderRadius: '8px', 
                                                                            cursor: 'pointer', 
                                                                            objectFit: 'cover', 
                                                                            border: isSelected ? `3px solid ${theme.colors.secondary}` : 'none' 
                                                                            }} />
                                                                    <Checkbox 
                                                                        size="small" 
                                                                        checked={!!isSelected} 
                                                                        onChange={
                                                                            () => toggleAssetApproval(key, url)
                                                                            } 
                                                                        sx={{ 
                                                                            position: 'absolute', 
                                                                            top: -8, 
                                                                            right: -8, 
                                                                            color: theme.colors.secondary, 
                                                                            '&.Mui-checked': { color: theme.colors.secondary } 
                                                                            }} />
                                                                </Box>
                                                            )
                                                        })}
                                                    </Box>
                                                </Box>
                                            )
                                        })}
                                    </React.Fragment>
                                ))}

                                <Typography 
                                    variant="h5" 
                                    fontWeight="bold" 
                                    sx={{ 
                                        mt: 4 
                                        }} 
                                    color={theme.colors.text}
                                    >Captions</Typography>
                                {campaignResult.captions?.map((_: string, i: number) => (
                                    <Box 
                                        key={i} 
                                        sx={{ mb: 2, 
                                              p: 2, 
                                              border: '1px solid #eee', 
                                              borderRadius: '12px', 
                                              display: 'flex', 
                                              justifyContent: 'space-between', 
                                              alignItems: 'center', 
                                              gap: 2 
                                              }}>
                                        {/* <Checkbox 
                                            checked={approvedCaptions.includes(i)} 
                                            onChange={
                                                () => toggleCaptionApproval(i)
                                                } /> */}
                                        {isEditing[`cap-${i}`] ? 
                                            <TextField 
                                                fullWidth 
                                                size="small" 
                                                //editableContent[sectionKey] as string[])[i]
                                                value={(editableContent.captions as string[])[i]} 
                                                onChange={
                                                    (e) => handleEditChange('captions', i, e.target.value)
                                                } /> : 
                                            <Typography 
                                                variant="body2" 
                                                sx={{ 
                                                    flex: 1
                                                 }} 
                                                 color={theme.colors.text}
                                                 >{(editableContent.captions as string[])[i]}</Typography>
                                        }
                                        <Button 
                                            variant="contained" 
                                            size="small" 
                                            onClick={
                                                () => toggleEdit(`cap-${i}`)
                                                }
                                            sx={{
                                                background: theme.colors.textSecondary
                                            }}
                                                >Edit</Button>
                                    </Box>
                                ))}

                                <Box 
                                    sx={{ 
                                        mt: 6, 
                                        display: 'flex', 
                                        gap: 2 
                                        }}>
                                    <Button 
                                        variant="contained"  
                                        fullWidth onClick={handleReset}
                                        sx={{
                                            background: theme.colors.error
                                        }}
                                        >Reset All Data</Button>
                                    <Button 
                                        variant="contained" 
                                        fullWidth 
                                        onClick={
                                            () => setIsApproved(true)
                                            }
                                        sx={{
                                            background: theme.colors.textSecondary
                                        }}
                                            >Approved</Button>
                                </Box>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Box>
            </Box>

            {/* SECTION 2: SCHEDULE (Accessed only after Approved button) */}
            {isApproved && (
                <Box ref={scheduleRef} 
                    sx={{ 
                        minHeight: '100vh', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'flex-start', 
                        background: 'transparent', 
                        p: 6
                        }}>
                    <Box 
                        sx={{ 
                            width: '900%', 
                            maxWidth: '1800px',
                            mt: 10, 
                            background: theme.colors.background,
                            borderRadius: theme.borderRadius,
                            boxSizing: 'border-box',
                            p: 6
                            }}>
                        <Typography 
                            variant="h2" 
                            fontWeight="bold" 
                            gutterBottom
                            >Campaign Editor</Typography>
                        

                        <Box 
                            sx={{ 
                                bgcolor: theme.colors.primary, 
                                border: `1px solid ${theme.colors.border}`, 
                                p: 2, 
                                borderRadius: '8px', 
                                mb: 4, 
                                display: 'flex', 
                                gap: 2, 
                                alignItems: 'center' }}>
                                <WarningAmber sx={{ color: '#F59E0B' }} />
                                <Box>
                                    <Typography 
                                        variant="subtitle2" 
                                        fontWeight="bold"
                                        >Review your selection</Typography>
                                    <Typography 
                                        variant="caption" 
                                        color="text.secondary"
                                        >You are scheduling assets approved in the previous step.</Typography>
                                </Box>
                        </Box>

                        <Typography 
                            variant="h6" 
                            fontWeight="bold" 
                            sx={{ 
                                mb: 3
                                 }}
                                 >When should this campaign go live?</Typography>

                        <Box>
                            <Typography 
                                    variant="caption" 
                                    fontWeight="bold" 
                                    sx={{ 
                                        mb: 1, 
                                        display: 'block' }}
                                        >Launch Date</Typography>
                                <DatePicker 
                                    value={launchDate} 
                                    onChange={
                                        (newValue) => setLaunchDate(newValue)
                                        } sx={{ 
                                            width: '180px', 
                                            bgcolor: '#fff' 
                                            }} 
                                    slots={{ openPickerIcon: CalendarMonth }} />
                            <Typography 
                                    variant="caption" 
                                    fontWeight="bold" 
                                    sx={{ 
                                        mb: 1, 
                                        display: 'block' 
                                        }}>Launch Time</Typography>
                                <TimePicker 
                                    value={launchTime} 
                                    onChange={
                                        (newValue) => setLaunchTime(newValue)
                                        } 
                                    sx={{ 
                                        width: '180px', 
                                        bgcolor: '#fff' 
                                        }} 
                                    slots={{ 
                                        openPickerIcon: AccessTime 
                                        }} />
                        </Box>

                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>Select Social Platforms</Typography>
                        <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'start',
                            alignItems: 'center',
                            gap: 2,
                            mb: 2
                        }}
                        >
                            {platforms.map((platform) => (
                                <Box
                                
                                >
                                    <Box 
                                        onClick={
                                            () => setSelectedPlatforms(prev => prev.includes(platform.name) ? prev.filter(p => p !== platform.name) : [...prev, platform.name])
                                        } 
                                        sx={{ 
                                            p: 2, 
                                            border: selectedPlatforms.includes(platform.name) ? `4px solid ${theme.colors.secondary}` : '1px solid #E2E8F0', 
                                            borderRadius: '12px', 
                                            cursor: 'pointer', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: 2, 
                                            bgcolor: theme.colors.primary, 
                                            position: 'relative' 
                                            }}>
                                        <Paper 
                                            elevation={2} 
                                            sx={{ 
                                                p: 1, 
                                                bgcolor: '#F1F5F9', 
                                                borderRadius: theme.borderRadius, 
                                                display: 'flex' 
                                                }}>{platform.icon}</Paper>
                                        <Box>
                                            <Typography 
                                                variant="subtitle2" 
                                                fontWeight="bold"
                                                >{platform.name}</Typography>
                                            <Typography 
                                                variant="caption" 
                                                color="text.secondary"
                                                >{platform.handle}</Typography>
                                        </Box>
                                        {selectedPlatforms.includes(platform.name) && 
                                            <CheckCircle sx={{ 
                                                            position: 'absolute', 
                                                            right: 8, 
                                                            top: 8, 
                                                            color: theme.colors.secondary, 
                                                            fontSize: '18px' 
                                                                }} />}
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                        <Box 
                            sx={{ 
                                bgcolor: theme.colors.primary, 
                                p: 2, 
                                borderRadius: '12px', 
                                border: `1px solid ${theme.colors.border}`, 
                                mb: 4, 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center' 
                                }}>
                            <Box>
                                <Typography 
                                    variant="subtitle2" 
                                    fontWeight="bold"
                                    >Enable Post Notifications</Typography>
                                <Typography 
                                    variant="caption" 
                                    color="text.secondary"
                                    >We'll notify you once the campaign has been successfully posted.</Typography>
                            </Box>
                            <Switch 
                                checked={notificationsEnabled} 
                                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                                color='secondary' 
                                />
                        </Box>

                        <Button 
                            variant="contained" 
                            size="large" 
                            sx={{ 
                                py: 2, 
                                borderRadius: '12px', 
                                bgcolor: theme.colors.secondary, 
                                textTransform: 'none', 
                                fontWeight: 'bold' 
                                }}>Schedule Campaign</Button>
                        <Button 
                            sx={{ 
                                mt: 4
                                 }} 
                            onClick={handleBack}
                            >Back to Editor</Button>
                    </Box>
                </Box>
            )}

            <Dialog 
                open={!!selectedImg} 
                onClose={
                    () => setSelectedImg(null)
                    } 
                maxWidth="lg">
                <Box 
                    sx={{ 
                        position: 'relative' 
                        }}>
                    <IconButton 
                        onClick={
                            () => setSelectedImg(null)
                            } 
                        sx={{ 
                            position: 'absolute', 
                            right: 8, 
                            top: 8, 
                            bgcolor: 'rgba(255,255,255,0.7)' 
                            }}>x</IconButton>
                    <DialogContent 
                        sx={{ 
                            p: 0 
                            }}>{
                                selectedImg && 
                                <img 
                                    src={selectedImg} 
                                    style={{ 
                                        width: '100%', 
                                        height: 'auto', 
                                        display: 'block' 
                                        }} 
                                        />}</DialogContent>
                </Box>
            </Dialog>
        </Box>
        </LocalizationProvider>
    )
}

export default Campaign;