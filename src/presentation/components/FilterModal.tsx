import type { FilterType } from "@app/types/filter";
import { useEffect, useState } from "react";
import { View } from "react-native";
import {
  Portal,
  Modal,
  Text,
  Button,
  TextInput,
  RadioButton,
  Checkbox,
  Divider,
} from "react-native-paper";

type Props = {
  visible: boolean;
  onDismiss: () => void;
  initialValues?: Partial<FilterType>;
  onApply: (values: FilterType) => void;
};

export const defaultFilters: FilterType = {
  query: "",
  status: "all",
  sortBy: "created_at",
  sortOrder: "desc",
  hasImage: false,
  hasLocation: false,
};

export function FilterModal({ visible, onDismiss, onApply, initialValues }: Props) {
  const [values, setValues] = useState<FilterType>({
    ...defaultFilters,
    ...initialValues,
  });

  useEffect(() => {
    if (visible) {
      setValues({ ...defaultFilters, ...initialValues });
    }
  }, [visible, initialValues]);

  const apply = () => {
    onApply(values);
    onDismiss();
  };

  const clear = () => {
    const reset = { ...defaultFilters };
    setValues(reset);
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={{
          margin: 16,
          borderRadius: 16,
          padding: 16,
          backgroundColor: "white",
        }}
      >
        <Text variant="titleMedium" style={{ marginBottom: 8 }}>
          Filters
        </Text>

        <TextInput
          mode="outlined"
          label="Search"
          value={values.query}
          onChangeText={query => setValues(v => ({ ...v, query }))}
          left={<TextInput.Icon icon="magnify" />}
          style={{ marginBottom: 12 }}
        />

        <Text variant="labelLarge" style={{ marginBottom: 6 }}>
          Status
        </Text>
        <RadioButton.Group
          onValueChange={status =>
            setValues(v => ({ ...v, status: status as FilterType["status"] }))
          }
          value={values.status}
        >
          <View style={{ flexDirection: "row", gap: 16, marginBottom: 8 }}>
            <Radio withLabel label="All" value="all" />
            <Radio withLabel label="Completed" value="completed" />
            <Radio withLabel label="Pending" value="pending" />
          </View>
        </RadioButton.Group>

        <Divider style={{ marginVertical: 8 }} />

        <Text variant="labelLarge" style={{ marginBottom: 6 }}>
          Sort
        </Text>
        <View style={{ flexDirection: "row", gap: 12, marginBottom: 8 }}>
          <Radio
            withLabel
            label="Created at"
            value="created_at"
            selected={values.sortBy === "created_at"}
            onPress={() => setValues(v => ({ ...v, sortBy: "created_at" }))}
          />
          <Radio
            withLabel
            label="Title"
            value="title"
            selected={values.sortBy === "title"}
            onPress={() => setValues(v => ({ ...v, sortBy: "title" }))}
          />
        </View>
        <View style={{ flexDirection: "row", gap: 12, marginBottom: 8 }}>
          <Radio
            withLabel
            label="Asc"
            value="asc"
            selected={values.sortOrder === "asc"}
            onPress={() => setValues(v => ({ ...v, sortOrder: "asc" }))}
          />
          <Radio
            withLabel
            label="Desc"
            value="desc"
            selected={values.sortOrder === "desc"}
            onPress={() => setValues(v => ({ ...v, sortOrder: "desc" }))}
          />
        </View>

        <Divider style={{ marginVertical: 8 }} />

        <View style={{ gap: 6 }}>
          <Checkbox.Item
            label="Only with image"
            status={values.hasImage ? "checked" : "unchecked"}
            onPress={() => setValues(v => ({ ...v, hasImage: !v.hasImage }))}
          />
          <Checkbox.Item
            label="Only with location"
            status={values.hasLocation ? "checked" : "unchecked"}
            onPress={() => setValues(v => ({ ...v, hasLocation: !v.hasLocation }))}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 16,
          }}
        >
          <Button mode="text" onPress={clear}>
            Clear
          </Button>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Button onPress={onDismiss}>Cancel</Button>
            <Button mode="contained" onPress={apply}>
              Apply
            </Button>
          </View>
        </View>
      </Modal>
    </Portal>
  );
}

function Radio({
  withLabel,
  label,
  value,
  selected,
  onPress,
}: {
  withLabel?: boolean;
  label: string;
  value: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <RadioButton value={value} status={selected ? "checked" : "unchecked"} onPress={onPress} />
      {withLabel ? <Text onPress={onPress}>{label}</Text> : null}
    </View>
  );
}
