import { TextInput, StyleSheet, type TextInputProps, View, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { SuraLabel } from './SuraText';

export function SuraInput({
  label,
  style,
  rightIcon,
  onRightIconPress,
  ...props
}: TextInputProps & {
  label?: string;
  rightIcon?: keyof typeof MaterialIcons.glyphMap;
  onRightIconPress?: () => void;
}) {
  return (
    <View style={styles.wrap}>
      {label ? <SuraLabel>{label}</SuraLabel> : null}
      <View style={styles.inputContainer}>
        <TextInput
          placeholderTextColor={Colors.outline}
          style={[styles.input, style]}
          {...props}
        />
        {rightIcon && (
          <Pressable onPress={onRightIconPress} style={styles.iconButton}>
            <MaterialIcons name={rightIcon} size={24} color={Colors.outline} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: Spacing.md },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceContainerLow,
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: Spacing.md,
    color: Colors.onSurface,
    fontSize: 14,
  },
  iconButton: {
    paddingHorizontal: Spacing.md,
    height: '100%',
    justifyContent: 'center',
  },
});
