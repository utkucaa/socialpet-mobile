import { useErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';

import useTheme from '@/theme/hooks/useTheme';
import layout from '@/theme/layout';
import gutters from '@/theme/gutters';

import { IconByVariant } from '@/components/atoms';

type Props = {
  onReset?: () => void;
};

function DefaultErrorScreen({ onReset = undefined }: Props) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { resetBoundary } = useErrorBoundary();

  return (
    <View
      style={[
        layout.flex_1,
        layout.justifyCenter,
        layout.itemsCenter,
        gutters.gap_16,
        gutters.padding_16,
      ]}
    >
      <IconByVariant
        height={42}
        path="fire"
        stroke="red"
        width={42}
      />
      <Text style={{ color: '#333', fontWeight: 'bold', fontSize: 16 }}>
        {t('error_boundary.title')}
      </Text>
      <Text style={{ color: '#333', fontSize: 12, textAlign: 'center' }}>
        {t('error_boundary.description')}
      </Text>

      {onReset && (
        <TouchableOpacity
          onPress={() => {
            resetBoundary();
            onReset?.();
          }}
        >
          <Text style={{ color: '#333', fontSize: 16 }}>
            {t('error_boundary.cta')}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default DefaultErrorScreen;
