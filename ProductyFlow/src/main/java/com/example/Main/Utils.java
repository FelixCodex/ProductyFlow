package com.example.Main;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.multipart.MultipartFile;

import com.example.Main.Models.Groups;
import com.example.Main.Models.Role;
import com.example.Main.Models.Users;
import com.example.Main.Repositories.GroupCalendarListRepository;
import com.example.Main.Repositories.GroupListRepository;
import com.example.Main.Repositories.GroupRepository;
import com.example.Main.Repositories.MemberLinkRepository;
import com.example.Main.Repositories.UserRepository;
import com.example.Main.Requests.ProjectManagerRequest;
import com.example.Main.Services.JwtService;
import com.google.gson.Gson;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

public class Utils {


    /**
     * Gets the user from the User Repository through a token
     * @param token - A string object (must not be null)
     * @return The user if exists otherwise returns null
     */
    public static Users getUser(String token,JwtService jwtService, UserRepository userRepository) {
        Users user = null;
        String username = null;

        try {
            username = jwtService.getUsernameFromToken(token);
            user = userRepository.findByUsername(username).orElseThrow();
        } catch (Exception e) {
            return user;
        }

        return user;
    }

    /**
     * Transforms a JSON String object to the specified class
     * @param jsonString - The JSON string object to transform (must not be null)
     * @param outputClass - The class in which it is returned the JSON (must not be null)
     * @return An object of the class in the outputClass param
     */
    public static <T> T transformFromJson(String jsonString, Class<T> outputClass) {
        Gson gson = new Gson();
        return gson.fromJson(jsonString, outputClass);
    }

    /**
     * Gets the group from the Group Repository through an Id
     * @param id - The string id of the group (must not be null)
     * @return The group if exists otherwise returns null
     */
    public static Groups getGroupById(String id,GroupRepository groupRepository) {
        Groups group = null;

        try {
            group = groupRepository.findById(id).orElseThrow();
        } catch (Exception e) {
            return group;
        }

        return group;
    }

    /**
     * Adds an access token cookie to the response entity
     * @param res - The response entity to add the access token cookie (must not be null)
     * @param token - The token to add to the response entity (must not be null)
     * @param cookieName - The name which the cookie will have (must not be null)
     */
    public static void setAccessToken(HttpServletResponse res, String token, String cookieName) {
        Cookie cookie = new Cookie(cookieName, token);
        cookie.setMaxAge(24 * 60 * 60);
        cookie.setPath("/");
        res.addCookie(cookie);
    }

    /**
     * Evaluates if a string is a numeric or a character string
     * @param strNum - The string to evaluate (must not be null)
     * @return boolean : true if numeric, false if string
     */
    public static boolean isNumeric(String strNum) {
        if (strNum == null) {
            return false;
        }
        try {
            Double.parseDouble(strNum);
        } catch (NumberFormatException nfe) {
            return false;
        }
        return true;
    }

    /**
     * Uploads a MultipartFile object to the specified path.
     * Only accepts files with .jpg, .jpeg, .png extension and below 5MB
     * @param fileToUpload - A MultipartFile object to upload (must not be null)
     * @param pathFolder - The path to upload the MultipartFile object (must not be null)
     * @return The name of the file uploaded which is generated randomly like a UUID
     */
    public static String uploadFile(MultipartFile fileToUpload, String pathFolder) {
        String error = null;
        String newFileName;

        try {
            String fileName = UUID.randomUUID().toString();
            byte[] bytes = fileToUpload.getBytes();
            String fileOgName = fileToUpload.getOriginalFilename();

            long fileSize = fileToUpload.getSize();
            long maxFileSize = 5 * 1024 * 1024;

            if (fileSize > maxFileSize) {
                return "fileMustBeLessThan5Mb";
            }

            if (!fileOgName.endsWith(".jpg") &&
                !fileOgName.endsWith(".jpeg") &&
                !fileOgName.endsWith(".png")) {
                return "fileExtensionNotSupported";
            }

            String fileExtension = fileOgName.substring(fileOgName.lastIndexOf("."));
            newFileName = fileName + fileExtension;

            File folder = new File("src/main/resources/" + pathFolder);

            if (!folder.exists()) {
                folder.mkdirs();
            }

            Path path = Paths.get("src/main/resources/" + pathFolder + "/" + newFileName);
            Files.write(path, bytes);

        } catch (Exception e) {
            return "errorUploadingImg";
        }
        return newFileName;
    }
}