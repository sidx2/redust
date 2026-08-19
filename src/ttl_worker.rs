use std::sync::{Arc, Mutex};

use crate::Map;

pub async fn ttl_worker(map: Arc<Mutex<Map>>) {

    let mut interval = tokio::time::interval(tokio::time::Duration::from_secs(1));
    loop {
        interval.tick().await;

        {
            let mut map_lock = map.lock().expect("failed to aquire lock on map");
            for (key, value) in map_lock.map_string_ttl_item.clone().into_iter() {                
                if value.ttl < tokio::time::Instant::now() {
                    let vv = value.value;
                    println!("cleaned up the value={vv}");
                    map_lock.map_string_ttl_item.remove(&key);
                }
            }
        }
        
    }
}