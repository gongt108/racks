import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/supabaseClient';

import { garmentTypes } from '@/constants/garmentTypes';
import { useAuth } from '@/hooks/useAuth';

import UploadIcon from '@mui/icons-material/Upload';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { FaShirt, FaDollarSign } from 'react-icons/fa6';
import { BsFillInfoCircleFill } from 'react-icons/bs';
import { IoIosClose } from 'react-icons/io';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

import {
  handleBulkClick,
  handleSingleClick,
  handleCameraClick,
  handleBulkUpload,
  handleSingleUpload,
  removeImage,
} from '@/util...