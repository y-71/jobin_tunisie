package com.example.Backend.Service;

import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.stereotype.Service;

import java.io.FileOutputStream;

@Service
public class FileService {

    final String IMAGES_OUTPUT_PATH = "src/output/images/";
    final String IMAGE_PREFIX = "image";
    final String RESUMES_OUTPUT_PATH = "src/output/resumes/";
    final String RESUME_PREFIX = "resume";

    public String saveBase64EncodedImage(Long resumeId, String base64EncodedImage) {
        try
        {
            String imageExtension = base64EncodedImage.split(",")[0].split("/")[1].split(";")[0];
            //This will decode the String which is encoded by using Base64 class
            byte[] imageBytes = Base64.decodeBase64(base64EncodedImage.split(",")[1]);

            String filePath = getImagePath(resumeId, imageExtension);

            FileOutputStream fileOutputStream = new FileOutputStream(filePath);
            fileOutputStream.write(imageBytes);
            return imageExtension;
        }
        catch(Exception e)
        {
            e.printStackTrace();
            return "";
        }
    }

    public String getImagePath(Long resumeId, String imageExtension) {
        return System.getProperty("user.dir") + '/' + IMAGES_OUTPUT_PATH + IMAGE_PREFIX + resumeId + "." + imageExtension;
    }

    public String getResumePath(Long resumeId) {
        return System.getProperty("user.dir") + '/' + RESUMES_OUTPUT_PATH + RESUME_PREFIX + resumeId + ".pdf";
    }

}
