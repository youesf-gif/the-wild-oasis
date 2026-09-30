import supabase, { supabaseUrl } from "./supabase";

export async function getCabins() {
    let { data: cabins, error } = await supabase.from("cabins").select("*");

    if (error) {
        console.error(error);
        throw new Error("Cabins could not loaded");
    }

    return cabins;
}

export async function createEditCabin(newCabin, id) {
    const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);

    const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
        "/",
        "",
    );
    const imagePath = hasImagePath
        ? newCabin.image
        : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

    //https://ilstrejnkjfbjxkouwsw.supabase.co/storage/v1/object/public/cabin-images/cabin-001.jpg

    // 1. Create/Edit cabin
    let query = supabase.from("cabins");

    // A) CREATE
    if (!id || typeof id !== "number")
        query = query.insert([{ ...newCabin, image: imagePath }]);

    // B) EDIT
    if (id && typeof id === "number")
        query = query.update({ ...newCabin, image: imagePath }).eq("id", id);

    const { data, error } = await query.select().single();

    if (error) {
        console.error(error);
        throw new Error("Cabins could not created");
    }

    // 2. upload image
    if (hasImagePath) return data;

    const { error: storageError } = await supabase.storage
        .from("cabin-images")
        .upload(imageName, newCabin.image);

    // 3. delete the cabin if threre was an error uploading image
    if (storageError) {
        await supabase.from("cabins").delete().eq("id", data.id);
        console.error(storageError);
        throw new Error(
            "Cabins image could not be uploaded and the cabin was not created ",
        );
    }
    return data;
}

export async function deleteCabin(id) {
    const { data, error } = await supabase.from("cabins").delete().eq("id", id);

    if (error) {
        console.error(error);
        throw new Error("Cabins could not deleted");
    }

    return data;
}
