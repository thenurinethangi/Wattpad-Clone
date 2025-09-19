package lk.ijse.wattpadbackend.service.impl;

import lk.ijse.wattpadbackend.entity.User;
import lk.ijse.wattpadbackend.entity.UserMute;
import lk.ijse.wattpadbackend.exception.NotFoundException;
import lk.ijse.wattpadbackend.exception.UserNotFoundException;
import lk.ijse.wattpadbackend.repository.UserMuteRepository;
import lk.ijse.wattpadbackend.repository.UserRepository;
import lk.ijse.wattpadbackend.service.UserMuteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserMuteServiceImpl implements UserMuteService {

    private final UserMuteRepository userMuteRepository;
    private final UserRepository userRepository;

    @Override
    public boolean addAMute(String name, long userId) {

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

            UserMute userMute1 = userMuteRepository.findByMutedByUserAndMutedUser(currentUser,user);
            if(userMute1!=null){
                return false;
            }

            UserMute userMute = new UserMute();
            userMute.setMutedByUser(currentUser);
            userMute.setMutedUser(user);

            userMuteRepository.save(userMute);
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
    public boolean removeAMute(String name, long userId) {

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

            UserMute userMute = userMuteRepository.findByMutedByUserAndMutedUser(currentUser,user);
            if(userMute==null){
                return false;
            }

            userMuteRepository.delete(userMute);
            return true;

        }
        catch (UserNotFoundException | NotFoundException e){
            throw e;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }
}











