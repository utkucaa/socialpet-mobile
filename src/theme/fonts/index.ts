import { TextStyle } from 'react-native';
import { generateFontSizes, generateFontColors } from '../fonts';
import { config } from '../_config';

const fonts = {
  ...generateFontSizes(),
  ...generateFontColors(config),
};

export default fonts;
