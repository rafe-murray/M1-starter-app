# M1
<!-- TODO: reorder by severity -->
## List of issues

### Issue 1: Leaving profile menu causes bio updated message

**Description**: 

- When leaving profile menu a pop-up at bottom says bio updated when no changes have been made

**How it was fixed?**: [WRITE_ISSUE_SOLUTION]

### Issue 2: Users cannot delete accounts

**Description**:

- Clicking "delete account" returns the user to the authentication page but does not remove data associated with the account
- This includes hobbies and profile data

**How it was fixed?**: 
- The deleteProfile function just signed the user out
- Added a new method in the UserInterface which calls DELETE on /user/profile for a given user
- Added a function in the ProfileViewModel that deletes the current user
- Call that from existing delete button handler

### Issue 3: Silent error when signing up with existing account

**Description**:
- Clicking sign up with an existing account does nothing, but also gives no indication that it doesn't work

### Issue 4: Misleading caching of hobby data

**Description**:

- Hobby data is saved locally on the device even when the user doesn't click "save" so it is not apparent to the user that their changes will not be persistent
- Clicking save on hobbies also resets local storage of profile changes (?)

### Issue 5: Cannot save profile after selecting a new profile picture
### Issue 6: ProfileViewModel.kt has multiple responsibilities
- Manages both the hobbies and profile, which could maybe be separated
### Cannot edit the bio textbox
### Cropping doesn't work for taking a photo
...
