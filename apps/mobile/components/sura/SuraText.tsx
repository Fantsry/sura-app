import { Text, type TextProps, StyleSheet } from 'react-native';
import { Colors, Typography } from '@/constants/theme';

type Variant = keyof typeof Typography;

export function SuraText({
  variant = 'bodyMd',
  color = Colors.onSurface,
  style,
  ...props
}: TextProps & { variant?: Variant; color?: string }) {
  const fontFamily =
    variant === 'h1' || variant === 'h2' || variant === 'h3' || variant === 'labelBold' || variant === 'button'
      ? 'Inter_700Bold'
      : variant === 'bodyLg'
        ? 'Inter_600SemiBold'
        : 'Inter_400Regular';
  return <Text style={[Typography[variant], { color, fontFamily }, style]} {...props} />;
}

export function SuraLabel({ children, style, ...props }: TextProps) {
  return (
    <SuraText
      variant="labelBold"
      color={Colors.onSurfaceVariant}
      style={[styles.label, style]}
      {...props}
    >
      {children}
    </SuraText>
  );
}

const styles = StyleSheet.create({
  label: { textTransform: 'uppercase', marginBottom: 4 },
});
