cmake_minimum_required(VERSION 3.13)
project(learnOpenGL)

set(CMAKE_CXX_STANDARD 14)
# depending on the name of the glfw folder
set(GLFW glfw-3.3)

# required libraries in libs directory
add_subdirectory(libs/${GLFW})
include_directories(libs/${GLFW}/include)
include_directories(libs/glad/include)
include_directories(libs/glm)

# library for loading images
set(STD_IMAGE libs/stb_image.h libs/load_images.cpp)
set(SRC src/main.cpp src/Shader.h)

add_executable(learnOpenGL ${SRC} ${STD_IMAGE} libs/glad/src/glad.c)
target_link_libraries(learnOpenGL glfw ${GLFW_LIBRARIES})