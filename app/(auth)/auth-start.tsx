import MediaPicker from "@/src/components/ui/media-picker";
import { useLanguage } from "@/src/context/language";
import { useThemeStore } from "@/src/store/themeStore";
import { useTheme } from "@/src/theme";
import { MediaDataType } from "@/src/utils/media";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
function AuthStart() {
  const { t } = useTranslation();
  const { setThemeMode, toggleTheme } = useThemeStore();
  const { setLanguage } = useLanguage();
  const theme = useTheme();
  const [enable, setEnable] = useState(false);
  const [age, setAge] = useState<number>(18);
  const [gender, setGender] = useState<"male" | "female">();
  const [range, setRange] = useState<[number, number]>([20, 80]);

  const { control } = useForm({
    defaultValues: {
      date: undefined,
      date1: undefined,
    },
  });

  const [media, setMedia] = useState<MediaDataType[]>([]);

  useEffect(() => {
    console.log(media, "=====");
  }, [media]);
  return (
    <SafeAreaView>
      <MediaPicker
        label="Upload Photo"
        selectMultiple
        allowedTypes={ImagePicker.MediaTypeOptions.Videos}
        onSelect={(selected) => {
          setMedia((prev) => {
            if (Array.isArray(selected)) {
              return [...prev, ...selected];
            }
            return [...prev, selected];
          });
        }}
      />
      {/* <ThemeView padded> */}

      {/* <Input
            control={control}
            name="name"
            label={t(LocalizedStrings.APP.WELCOME)}
            keyboardType="default"
            icon={<Ionicons name="eye" />}
            // multiline
          />

          <Input
            control={control}
            name="name"
            label={t(LocalizedStrings.APP.WELCOME)}
            keyboardType="default"
            icon={<Ionicons name="eye" />}
            multiline
          />
        </ThemeView>
*/}
      {/* <Select
          control={control}
          name="name"
          label="Cities"
          placeholder="Select cities"
          searchable={false}
          options={[
            { label: "Mumbai", value: "mumbai" },
            { label: "Delhi", value: "delhi" },
            { label: "Bangalore", value: "blr" },
          ]}
        /> */}
      {/* <Button
          title={t(LocalizedStrings.APP.WELCOME)}
          rightIcon={<Ionicons name="eye" />}
          onPress={() => setLanguage("en")}
        />
        <Button title="Click Me" onPress={() => setThemeMode("system")} />
        <Button title="Click Me" onPress={() => setLanguage("es")} /> */}

      {/* <SearchBar
          control={control}
          name="name"
          searchIconPosition="right"
          placeholder="Search users..."
          onSearch={(string) => console.log(string)}
        /> */}

      {/* <SwitchControl
          
          value={true}
          label="label"
          description="description"
          // switchPosition="right"
        /> */}

      {/* <CheckBox
          label="Notifications"
          description="Receive email updates"
          checked={enable}
          onChange={setEnable}
          position="right"
        /> */}

      {/* <RadioButton
          onChange={setEnable}
          selected={enable}
          // disabled
          row={false}
          position="left"
          label="Notifications"
          // description="Receive email updates"
        />

        <RadioButton
          onChange={setEnable}
          selected={enable}
          
          // disabled
          position="left"
          // label="Notifications"
          description="Receive email updates"
        /> */}
      {/* <RadioGroup
      label={"choose one"}
        value={gender}
        onChange={setGender}
        options={[
          { label: "Male", value: "male", description: "description1" },
          { label: "Female", value: "female", description: "description2" },
        ]}
      /> */}

      {/* <CustomSlider label="Age" type="single" value={age} onChange={setAge} />
        <CustomSlider
          label="Age"
          type="singleWithInput"
          value={age}
          onChange={setAge}
        />
        <CustomSlider
          label="Age"
          type="range"
          rangeValue={range}
          onRangeChange={setRange}
        />
        <CustomSlider
          label="Age"
          type="rangeWithInputs"
          rangeValue={range}
          onRangeChange={setRange}
        /> */}
    </SafeAreaView>
  );
}

export default AuthStart;
