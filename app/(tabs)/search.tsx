import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/servises/api";
import { updataSearchCount } from "@/servises/appwrite";
import useFetch from "@/servises/useFetch";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const {
    data: moveis = [],
    loading,
    error,
    refetch: loadMovies,
    reset,
  } = useFetch(() => fetchMovies({ query: searchQuery }), false);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        await loadMovies();
      } else reset();
    }, 500);

    useEffect(() => {
      if (moveis?.length! > 0 && moveis?.[0]) {
        updataSearchCount(searchQuery, moveis[0]);
      }
    }, [moveis]);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="flex-1 absolute w-full z-0"
        resizeMode="cover"
      />

      <FlatList
        className="px-5"
        data={moveis as Movie[]}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <MovieCard {...item} />}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "center",
          gap: 20,
          marginVertical: 16,
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center mt-20 items-center">
              <Image source={icons.search} className="w-12 h-10" />
            </View>

            <View className="my-5">
              <SearchBar
                placeholder="Search for Movie"
                value={searchQuery}
                onChangeText={handleSearch}
              />
            </View>

            {loading && (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                className="my-3"
              />
            )}

            {error && (
              <Text className="text-red-500 px-5 my-5">
                Error : {error.message}
              </Text>
            )}

            {!loading &&
              !error &&
              searchQuery.trim() &&
              moveis?.length! > 0 && (
                <Text className="text-xl text-white font-bold">
                  <Text className="text-accent">{searchQuery}</Text>
                </Text>
              )}
          </>
        }
        ListEmptyComponent={
          !loading && !error ? (
            <View className="mt-10 px-5">
              <Text className="text-center text-gray-500">
                {searchQuery.trim()
                  ? "No Movies found"
                  : "Start Typeing to search for movies"}
              </Text>
            </View>
          ) : null
        }
      />

      <Text>Search</Text>
    </View>
  );
};

export default Search;
