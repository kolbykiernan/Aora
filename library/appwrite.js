import { Account, Avatars, Databases, Client, ID, Query, Storage } from 'react-native-appwrite';

export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.aora',
    projectId: '667b4a9c00256e916b6f',
    databaseId: '667b5e5b001ec0f12685',
    userCollectionId: '667b5e770039601dd5e3',
    videoCollectionId: '667b5ead000e68b3b392',
    storageId: '667b6856002efcf00dbf',
}

const {
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videoCollectionId,
    storageId,
} = config;

const client = new Client();

client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setPlatform(config.platform)

    const account = new Account(client);
    const avatars = new Avatars(client);
    const databases = new Databases (client)
    const storage = new Storage (client)

    export const createUser = async (email, password, username) => {
        try {
            const newAccount = await account.create(
                ID.unique(),
                email,
                password,
                username
            )

            if (!newAccount) throw Error;

            const avatarUrl = avatars.getInitials(username)

            await signIn(email, password);

            const newUser = await databases.createDocument(
                config.databaseId,
                config.userCollectionId,
                ID.unique(),
                {
                    accountId: newAccount.$id,
                    email: email,
                    username: username,
                    avatar: avatarUrl
                }
            )
            return newUser;

        } catch (error) {
            console.log(error)
            throw new Error(error)
        }
    }

    export const signIn = async (email, password) => {
        try {
            const session = await account.createEmailPasswordSession(email, password)

            return session;
        } catch (error) {
            throw new Error(error)
        }
    }

    export const getCurrentUser = async () => {
        try {
            const currentAccount = await account.get();
            if (!currentAccount) throw Error

            const currentUser = await databases.listDocuments(
                config.databaseId,
                config.userCollectionId,
                [Query.equal('accountId', currentAccount.$id)]
            )

            if(!currentUser) throw Error;

            return currentUser.documents[0]
        } catch (error) {
            console.log(error)
    }
}

export const getAllPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt')]
        ) 
        return posts.documents;
    } catch (error) {
        throw new Error(error)
    }
}
export const getLatestPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt'), Query.limit(7)]
        ) ;

        return posts.documents;
    } catch (error) {
        throw new Error(error)
    }
}
export const updatePostLikes = async (postId, accountId, liked) => {
    try {
        const post = await databases.getDocument(
            databaseId,
            videoCollectionId,
            postId
        );

        let likes = post.likes || [];

        if (liked) {
            if (!likes.includes(accountId)) {
                likes.push(accountId);
            }
        } else {
            likes = likes.filter(id => id !== accountId);
        }

        const updatedPost = await databases.updateDocument(
            databaseId,
            videoCollectionId,
            postId,
            { likes }
        );

        console.log('Successfully updated likes for post', postId, 'New likes:', updatedPost.likes);
    } catch (error) {
        console.error('Error updating likes:', error); // Debugging statement
        throw new Error(error);
    }
};



export const getSavedPosts = async (accountId) => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt')]
        );

        const likedPosts = posts.documents.filter(post => post.likes && post.likes.includes(accountId));

        return likedPosts;

    } catch (error) {
        console.error('Error fetching posts:', error); // Debugging statement
        throw new Error(error);
    }
};

export const searchPosts = async (query) => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.search('title', query)]
        ) ;

        if (!posts) throw new Error("Something went wrong");

        return posts.documents;
    } catch (error) {
        throw new Error(error)
    }
}

export const getUserPosts = async (userId) => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.equal('creator', userId)]
        ) ;

        return posts.documents;
    } catch (error) {
        throw new Error(error)
    }
}

export const signOut = async () => {
    try {
        const session = await account.deleteSession('current');
        return session;
    } catch (error) {
        throw new Error(error)
    }
}

export const getFilePreview = async (fileId, type) => {
    let fileUrl;
    try {
        if (type === 'video') {
            fileUrl = storage.getFileView(storageId, fileId)
        } else if (type === 'image') {
            fileUrl = storage.getFilePreview(storageId, fileId, 2000, 2000, 'top', 100)
        } else {
            throw new Error('Invalid file type')
        }
        
        if(!fileUrl) throw Error;

        return fileUrl;
    } catch (error) {
        throw new Error(error)
    }
}

export const uploadFile = async (file, type) => {
    if(!file) return;

    const { mimeType, ...rest } = file;
    const asset = { 
        name: file.fileName,
        type: file.mimeType,
        size: file.fileSize,
        uri: file.uri,
     };

    console.log('FILE', file)
    
    try {
        const uploadedFile = await storage.createFile(
            storageId,
            ID.unique(),
            asset
        )
        console.log('UPLOADED', uploadedFile)

        const fileUrl = await getFilePreview(uploadedFile.$id, type);
        return fileUrl;
    } catch (error) {
        throw new Error(error)
    }
}
export const createVideo = async (form) => {
    try {
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, 'image'),
            uploadFile(form.video, 'video'),
        ])

        const newPost = await databases.createDocument(
            databaseId, videoCollectionId, ID.unique(), {
                title: form.title,
                thumbnail: thumbnailUrl,
                video: videoUrl,
                prompt: form.prompt,
                creator: form.userId
            }
        )

        return newPost;
    } catch (error) {
        throw new Error(error)
    }
}
