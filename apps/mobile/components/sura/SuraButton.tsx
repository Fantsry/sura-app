import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { SuraText } from './SuraText';

type Props = Omit<PressableProps, 'style'> & {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'error';
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function SuraButton({
  title,
  variant = 'primary',
  loading,
  disabled,
  style,
  ...props
}: Props) {
  const v = variants[variant];
  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: v.bg, borderColor: v.border },
        pressed && styles.pressed,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={v.text} />
      ) : (
        <SuraText variant="button" color={v.text}>
          {title}
        </SuraText>
      )}
    </Pressable>
  );
}

const variants = {
  primary: { bg: Colors.primary, text: Colors.onPrimary, border: Colors.primary },
  secondary: { bg: Colors.secondaryContainer, text: Colors.onSecondaryContainer, border: Colors.secondaryContainer },
  outline: { bg: Colors.surfaceContainerLowest, text: Colors.primary, border: Colors.outlineVariant },
  error: { bg: Colors.error, text: Colors.onError, border: Colors.error },
};

const styles = StyleSheet.create({
  base: {
    height: 48,
    borderRadius: Radius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.5 },
});
