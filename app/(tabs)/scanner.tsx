import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  StatusBar,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { saveDailyData, getDailyData } from '@/utils/storage';
import { FoodResponse } from '@/types';
import { GoogleGenAI } from "@google/genai";
import { CameraView, CameraType, useCameraPermissions, FlashMode } from 'expo-camera';
import Constants from 'expo-constants';

const { width, height } = Dimensions.get('window');

// Get API key from environment variables
const GEMINI_API_KEY = Constants.expoConfig?.extra?.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is not defined in environment variables');
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const ScannerScreen = () => {
  const [image, setImage] = useState<string | null>(null);
  const { date, mealType } = useLocalSearchParams<{ date: string; mealType: string }>();
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<FlashMode>('off');
  const [permission, requestPermission] = useCameraPermissions();
  const [foodResponse, setFoodResponse] = useState<{ food_response: FoodResponse[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const cameraRef = useRef<CameraView>(null);

  // Reset all states when the tab is focused
  useFocusEffect(
    useCallback(() => {
      setImage(null);
      setFacing('back');
      setFlash('off');
      setFoodResponse(null);
      setIsLoading(false);
    }, [])
  );

  const toggleFlash = () => {
    setFlash(current =>
      current === 'off' ? 'on' : 'off'
    );
  };

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.grantContainer}>
        <Text style={{ textAlign: 'center', color: 'white' }}>We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text style={{ color: 'white', marginTop: 20 }}>Click here for grant permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePhoto = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,  // Adjust quality (0 to 1)
        base64: true,
        exif: false,   // Don't include EXIF data to reduce size
        imageType: 'jpg'  // Ensure JPEG format
      });

      if (!photo || !photo.base64) {
        throw new Error("Failed to capture photo or get base64 data");
      }

      setImage(photo.uri);
      processImageWithGemini(photo.uri, photo.base64);
    } catch (error) {
      console.error("Error taking photo:", error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setImage(result.assets[0].uri);
      processImageWithGemini(result.assets[0].uri, result.assets[0].base64);
    }
  };

  const processImageWithGemini = async (imageUri: string, base64Data?: string) => {
    try {
      setIsLoading(true);
      const contents = [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Data,
          },
        },
        { text: "Generate only one simple food name for provided image within 10 ~ 20 letters with &&& prefix and &&& suffix. Recommend a recipe for me based on the provided image. The recipe should only contain real, edible ingredients. If the image or images attached don't contain any food items, respond to say that you cannot recommend a recipe with inedible ingredients. Provide a summary of how many people the recipe will serve and the nutritional information per serving." },
      ];

      const geminiResponse = await ai.models.generateContent({
        model: "gemini-1.5-pro",
        contents: contents,
      });

      if (!geminiResponse.text) {
        throw new Error("No response text received from Gemini");
      }

      const responseText = geminiResponse.text;

      console.log(responseText);

      // Extract nutritional information using regex
      const caloriesMatch = responseText.match(/Calories:[^\d]*(\d+)(?:\s*-\s*(\d+))?/i);
      let calories = '0';
      if (caloriesMatch) {
        if (caloriesMatch[2]) {
          // If it's a range, use the average
          calories = Math.round((parseInt(caloriesMatch[1]) + parseInt(caloriesMatch[2])) / 2).toString();
        } else {
          calories = caloriesMatch[1];
        }
      }
      const proteinMatch = responseText.match(/Protein:\s*(\d+)/i);
      const fatMatch = responseText.match(/Fat:\s*(\d+)/i);
      const carbsMatch = responseText.match(/Carbohydrates:\s*(\d+)/i);

      // Extract food name from the new format with &&& markers
      const foodNameMatch = responseText.match(/&&&([^&]+)&&&/i);
      const recipeName = foodNameMatch ? foodNameMatch[1].trim() : 'Unknown Recipe';

      // Create food response object
      const foodResponseData = {
        food_response: [{
          food_id: parseInt(Date.now().toString()),
          food_entry_name: recipeName,
          eaten: {
            food_name_singular: recipeName.toLowerCase(),
            food_name_plural: `${recipeName.toLowerCase()}s`,
            total_nutritional_content: {
              calories,
              protein: proteinMatch ? proteinMatch[1] : '0',
              carbohydrate: carbsMatch ? carbsMatch[1] : '0',
              fat: fatMatch ? fatMatch[1] : '0'
            }
          }
        }]
      };

      setFoodResponse(foodResponseData);

      handleFoodResponse(foodResponseData, imageUri, base64Data || undefined);
    } catch (error) {
      console.error("Gemini API processing error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFoodResponse = async (response: { food_response: FoodResponse[] }, imageUri: string, base64Data?: string) => {
    if (!date || !mealType) return;

    const currentData = await getDailyData(date) || {
      date,
      calories: { eaten: 0, burned: 0 },
      macros: { protein: 0, carbs: 0, fat: 0 },
      water: 0,
      meals: [
        { title: 'Breakfast', totalCalories: 0, items: [] },
        { title: 'Lunch', totalCalories: 0, items: [] },
        { title: 'Snacks', totalCalories: 0, items: [] },
        { title: 'Dinner', totalCalories: 0, items: [] },
      ],
    };

    // Calculate total nutritional values from all foods
    const totalCalories = response.food_response.reduce((sum, food) =>
      sum + parseInt(food.eaten.total_nutritional_content.calories), 0);
    const totalProtein = response.food_response.reduce((sum, food) =>
      sum + parseFloat(food.eaten.total_nutritional_content.protein), 0);
    const totalCarbs = response.food_response.reduce((sum, food) =>
      sum + parseFloat(food.eaten.total_nutritional_content.carbohydrate), 0);
    const totalFat = response.food_response.reduce((sum, food) =>
      sum + parseFloat(food.eaten.total_nutritional_content.fat), 0);

    // Create a single meal item with combined totals
    const combinedMeal = {
      id: response.food_response[0].food_id.toString(),
      title: response.food_response[0].food_entry_name,
      calories: totalCalories,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      image: imageUri,
      macros: {
        protein: totalProtein,
        carbs: totalCarbs,
        fat: totalFat,
      },
    };

    // Add the combined meal to the selected meal section
    const updatedMeals = currentData.meals.map(section => {
      if (section.title === mealType) {
        return {
          ...section,
          totalCalories: section.totalCalories + totalCalories,
          items: [...section.items, combinedMeal],
        };
      }
      return section;
    });

    const updatedData = {
      ...currentData,
      calories: {
        ...currentData.calories,
        eaten: currentData.calories.eaten + totalCalories,
      },
      macros: {
        protein: currentData.macros.protein + totalProtein,
        carbs: currentData.macros.carbs + totalCarbs,
        fat: currentData.macros.fat + totalFat,
      },
      meals: updatedMeals,
    };

    await saveDailyData(date, updatedData);

    // Encode the image URI to preserve the double-encoded parts
    const encodedImageUri = encodeURIComponent(imageUri);

    // Pass the updated data back to tracking screen
    router.replace({
      pathname: '/(tabs)/tracking',
      params: {
        date,
        imageUri: encodedImageUri,
        newItem: JSON.stringify(combinedMeal),
        mealType
      }
    });
  };

  const handleBack = () => {
    router.back();
  };

  const renderScanOptions = () => (
    <View style={styles.scanOptions}>
      <TouchableOpacity style={[styles.scanOption, styles.scanOptionSelected]}>
        <Image source={require('../../assets/icons/reserve.png')} style={styles.iconContainer} />
        <Text style={[styles.optionText, styles.optionTextSelected]}>Scan Meal</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.scanOption}>
        <Image source={require('../../assets/icons/barcode.png')} style={styles.iconContainer} />
        <Text style={styles.optionText}>Barcode</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.scanOption}>
        <Image source={require('../../assets/icons/tag-right.png')} style={styles.iconContainer} />
        <Text style={styles.optionText}>Food Label</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scanner</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Scan Options */}
        {renderScanOptions()}
      </View>

      {/* Camera Preview */}
      <View style={styles.cameraContainer}>
        <View style={styles.cameraPlaceholder}>
          <View style={styles.overlay}>
            <View style={styles.scanFrame} />
            {image && <Image source={{ uri: image }} style={styles.imgContainer} />}
            {!image && <CameraView
              ref={cameraRef}
              style={styles.imgContainer}
              facing={facing}
              flash={flash}
            />}
          </View>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FF6B6B" />
              <Text style={styles.loadingText}>Analyzing food...</Text>
            </View>
          ) : (
            foodResponse && <>
              <Text style={styles.description}>Name: {foodResponse?.food_response[0].food_entry_name}</Text>
              <Text style={styles.description}>Calories: {foodResponse?.food_response[0].eaten.total_nutritional_content.calories}kcal</Text>
              <Text style={styles.description}>Protein: {foodResponse?.food_response[0].eaten.total_nutritional_content.protein}g</Text>
              <Text style={styles.description}>Carb: {foodResponse?.food_response[0].eaten.total_nutritional_content.carbohydrate}g</Text>
              <Text style={styles.description}>Fat: {foodResponse?.food_response[0].eaten.total_nutritional_content.fat}g</Text>
            </>
          )}
        </View>
      </View>


      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={toggleFlash}>
          <Image
            source={require('../../assets/icons/flash.png')}
            style={[styles.controlImage, flash === 'on' && styles.flashActive]}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton} onPress={pickImage}>
          <Image source={require('../../assets/icons/gallery.png')} style={styles.controlImage} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  grantContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222',
  },
  container: {
    flex: 1,
    backgroundColor: '#222',
    position: 'relative',
    height: height,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
  },
  backButton: {
    // padding: 8,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  headerRight: {
    width: 40,
  },
  scanOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  scanOption: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF33',
    borderColor: '#FFFFFF1A',
    borderWidth: 1,
    borderRadius: 20,
    minWidth: 100,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  scanOptionSelected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF1A',
  },
  iconContainer: {
    width: 24,
    height: 24,
    marginBottom: 8,
  },
  optionText: {
    color: 'white',
    fontSize: 12,
  },
  optionTextSelected: {
    color: 'black',
  },
  cameraContainer: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  cameraPlaceholder: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  scanFrame: {
    width: width * 0.74,
    height: width * 0.74,
    borderWidth: 4,
    borderColor: 'white',
    borderRadius: 20,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 40,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlImage: {
    width: 60,
    height: 60,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: '#1A1A1A',
  },
  imgContainer: {
    position: 'absolute',
    transform: [{ translateX: '-50%' }],
    left: '50%',
    width: width * 0.7,
    height: width * 0.7,
    zIndex: 10,
    borderRadius: 20,
    resizeMode: 'cover',
  },
  camera: {
    // flex: 1,
    width: '100%',
    height: 200,
  },
  flashActive: {
    borderWidth: 2,
    borderColor: '#FF6B6B',
    borderRadius: 50,
  },
  description: {
    fontSize: 20,
    color: '#FF6B6B',
    textAlign: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
    borderRadius: 10,
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
  },
});

export default ScannerScreen; 