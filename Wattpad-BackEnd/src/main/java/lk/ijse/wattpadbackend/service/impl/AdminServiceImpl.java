package lk.ijse.wattpadbackend.service.impl;

import lk.ijse.wattpadbackend.dto.*;
import lk.ijse.wattpadbackend.entity.*;
import lk.ijse.wattpadbackend.exception.NotFoundException;
import lk.ijse.wattpadbackend.exception.UserNotFoundException;
import lk.ijse.wattpadbackend.repository.RoleRepository;
import lk.ijse.wattpadbackend.repository.UserRepository;
import lk.ijse.wattpadbackend.repository.UserRoleRepository;
import lk.ijse.wattpadbackend.service.AdminService;
import lk.ijse.wattpadbackend.util.Roles;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final RoleRepository roleRepository;

    @Override
    public AdminAdminResponseDTO loadAdminForAdminBySortingCriteria(long no, AdminRequestDTO adminRequestDTO) {

        try{
            List<User> userList1 = userRepository.findAll();

            List<User> userList = new ArrayList<>();
            for (User x : userList1){
                List<UserRole> userRoleList = x.getUserRoles();
                for (UserRole y : userRoleList){
                    if(y.getRole().getRole()== Roles.ADMIN){
                        userList.add(x);
                    }
                }
            }

            AdminAdminResponseDTO adminAdminResponseDTO = new AdminAdminResponseDTO();
            adminAdminResponseDTO.setTotalAdmins(userList.size());

            List<User> sortAfterStatus = new ArrayList<>();
            for (User x : userList){
                if(adminRequestDTO.getStatus().equals("all")){
                    sortAfterStatus.add(x);
                }
                else if (adminRequestDTO.getStatus().equals("active")) {
                    if(x.getIsActive()==1){
                        sortAfterStatus.add(x);
                    }
                }
                else if (adminRequestDTO.getStatus().equals("deactive")) {
                    if(x.getIsActive()==0){
                        sortAfterStatus.add(x);
                    }
                }
            }

            long end = (no*12)-1;
            long start = ((end+1)-12);

            List<User> sortAfterCount = new ArrayList<>();
            if(sortAfterStatus.size()>start){
                for (long i = start; i <= end; i++) {
                    if(i<sortAfterStatus.size()){
                        sortAfterCount.add(sortAfterStatus.get((int) i));
                    }
                    else{
                        break;
                    }
                }
            }

            adminAdminResponseDTO.setStart(start+1);
            adminAdminResponseDTO.setEnd(end+1);

            List<AdminDTO> adminStoryDTOS = new ArrayList<>();
            for (User x : sortAfterCount){
                AdminDTO adminDTO = new AdminDTO();
                adminDTO.setId(x.getId());
                adminDTO.setEmail(x.getEmail());
                adminDTO.setPronouns(x.getPronouns());
                adminDTO.setFullName(x.getFullName());
                adminDTO.setUsername(x.getUsername());
                adminDTO.setIsActive(x.getIsActive());
                adminDTO.setProfilePicPath(x.getProfilePicPath());

                adminStoryDTOS.add(adminDTO);
            }

            adminAdminResponseDTO.setAdminDTOList(adminStoryDTOS);
            return adminAdminResponseDTO;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    @Transactional
    public boolean createANewAdmin(AdminDTO adminDTO) {

        try{
            List<User> userList1 = userRepository.findAll();

            List<User> userList = new ArrayList<>();
            for (User x : userList1){
                List<UserRole> userRoleList = x.getUserRoles();
                for (UserRole y : userRoleList){
                    if(y.getRole().getRole()== Roles.ADMIN){
                        userList.add(x);
                    }
                }
            }

            for (User x : userList){
                if(x.getUsername().equals(adminDTO.getUsername())){
                    return false;
                }
            }

            User user = new User();
            user.setEmail(adminDTO.getEmail());
            user.setIsActive(1);
            user.setPronouns(adminDTO.getPronouns());
            user.setUsername(adminDTO.getUsername());
            user.setFullName(adminDTO.getFullName());
            user.setPassword("admin0987");
            user.setBirthday(LocalDate.now());
            user.setIsVerify(1);
            user.setJoinedDate(LocalDate.now());
            user.setAbout("");
            user.setIsVerifiedByWattpad(1);
            user.setCoins(0);

            User savedUser = userRepository.save(user);

            Optional<Role> roleOptional = roleRepository.findByRole(Roles.ADMIN);
            if(!roleOptional.isPresent()){
                throw new NotFoundException("Role not found.");
            }
            Role role = roleOptional.get();

            UserRole userRole = new UserRole();
            userRole.setRole(role);
            userRole.setUser(savedUser);

            userRoleRepository.save(userRole);
            return true;

        }
        catch (NotFoundException e){
            throw e;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public boolean deactivateAdmin(long id) {

        try{
            Optional<User> userOptional = userRepository.findById((int) id);
            if(!userOptional.isPresent()){
                throw new UserNotFoundException("User not found.");
            }
            User user = userOptional.get();

            List<UserRole> userRoleList = user.getUserRoles();
            for (UserRole x : userRoleList){
                if(x.getRole().getRole()==Roles.ADMIN){
                    user.setIsActive(0);
                    userRepository.save(user);
                    return true;
                }
            }

            return false;

        }
        catch (UserNotFoundException e){
            throw e;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public AdminDTO getAdminById(long id) {

        try{
            Optional<User> userOptional = userRepository.findById((int) id);
            if(!userOptional.isPresent()){
                throw new UserNotFoundException("User not found.");
            }
            User user = userOptional.get();

            List<UserRole> userRoleList = user.getUserRoles();
            for (UserRole x : userRoleList){
                if(x.getRole().getRole()==Roles.ADMIN){
                    AdminDTO adminDTO = new AdminDTO();
                    adminDTO.setId(user.getId());
                    adminDTO.setPronouns(user.getPronouns());
                    adminDTO.setEmail(user.getEmail());
                    adminDTO.setUsername(user.getUsername());
                    adminDTO.setFullName(user.getFullName());
                    return adminDTO;
                }
            }

            return null;

        }
        catch (UserNotFoundException e){
            throw e;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }
}

















