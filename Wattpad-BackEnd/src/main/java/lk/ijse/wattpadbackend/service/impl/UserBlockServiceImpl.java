package lk.ijse.wattpadbackend.service.impl;

import lk.ijse.wattpadbackend.dto.UserDTO;
import lk.ijse.wattpadbackend.entity.User;
import lk.ijse.wattpadbackend.entity.UserBlock;
import lk.ijse.wattpadbackend.entity.UserMute;
import lk.ijse.wattpadbackend.exception.NotFoundException;
import lk.ijse.wattpadbackend.exception.UserNotFoundException;
import lk.ijse.wattpadbackend.repository.UserBlockRepository;
import lk.ijse.wattpadbackend.repository.UserRepository;
import lk.ijse.wattpadbackend.service.UserBlockService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserBlockServiceImpl implements UserBlockService {

    private final UserBlockRepository userBlockRepository;
    private final UserRepository userRepository;

    @Override
    public boolean addABlock(String name, long userId) {

        try{
            User currentUser = userRepository.findByUsername(name);
            if(currentUser==null){
                throw new UserNotFoundException("Current User not found.");
            }

            Optional<User> optionalUser = userRepository.findById((int) userId);
            if(!optionalUser.isPresent()){
                throw new NotFoundException("User not found.");
            }
            User user = optionalUser.get();

            UserBlock userBlock1 = userBlockRepository.findByBlockedByUserAndBlockedUser(currentUser,user);
            if(userBlock1!=null){
                return false;
            }

            UserBlock userBlock = new UserBlock();
            userBlock.setBlockedByUser(currentUser);
            userBlock.setBlockedUser(user);

            userBlockRepository.save(userBlock);
            return true;

        }
        catch (UserNotFoundException | NotFoundException e){
            throw e;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public boolean removeABlock(String name, long userId) {

        try{
            User currentUser = userRepository.findByUsername(name);
            if(currentUser==null){
                throw new UserNotFoundException("Current User not found.");
            }

            Optional<User> optionalUser = userRepository.findById((int) userId);
            if(!optionalUser.isPresent()){
                throw new NotFoundException("User not found.");
            }
            User user = optionalUser.get();

            UserBlock userBlock = userBlockRepository.findByBlockedByUserAndBlockedUser(currentUser,user);
            if(userBlock==null){
                return false;
            }

            userBlockRepository.delete(userBlock);
            return true;

        }
        catch (UserNotFoundException | NotFoundException e){
            throw e;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<UserDTO> getAllBlockedUsersOfCurrentUser(String name) {

        try {
            User currentUser = userRepository.findByUsername(name);
            if (currentUser == null) {
                throw new UserNotFoundException("Current User not found.");
            }

            List<UserBlock> userBlockList = userBlockRepository.findAllByBlockedByUser(currentUser);

            List<UserDTO> userDTOList = new ArrayList<>();
            for (UserBlock x : userBlockList){
                UserDTO userDTO = new UserDTO();
                userDTO.setId(x.getBlockedUser().getId());
                userDTO.setProfilePicPath(x.getBlockedUser().getProfilePicPath());
                userDTO.setUsername(x.getBlockedUser().getUsername());

                userDTOList.add(userDTO);
            }

            return userDTOList;

        }
        catch (UserNotFoundException | NotFoundException e){
            throw e;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }
}















