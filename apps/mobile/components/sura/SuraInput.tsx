import { TextInput, StyleSheet, type TextInputProps, View } from 'react-native';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { SuraLabel } from './SuraText';

export function SuraInput({
  label,
  style,
  ...props
}: TextInputProps & { label?: string }) {
  return (
    <View style={styles.wrap}>
      {label ? <SuraLabel>{label}</SuraLabel> : null}
      <TextInput
        placeholderTextColor={Colors.outline}
        style={[styles.input, style]}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: Spacing.md },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.surfaceContainerLow,
    color: Colors.onSurface,
    fontSize: 14,
  },
});
